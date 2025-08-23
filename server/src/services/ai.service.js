// modules/ai/ai.service.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const OpenAI = require('openai');
const httpStatus = require('http-status').default;
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

/**
 * GOAL
 * - Single input (message).
 * - Answer strictly from a shared context blob (no embeddings).
 * - Keep cost low: small model, short prompt, top-K relevant chunks only, caching, timeout.
 */

/* ------------------------ ENV / TUNABLES ------------------------ */
const parseNumber = (v, d) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const parseBool = (v, d) => {
  if (v === undefined || v === null) return d;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return ['1', 'true', 'yes', 'on'].includes(v.toLowerCase());
  return d;
};

const OPENAI_API_KEY    = config.openai?.apiKey;
const OPENAI_MODEL      = config.openai?.model || 'gpt-4o-mini';
const LLM_TIMEOUT_MS    = config.openai?.timeoutMs || 8000;
const STRICT_CONTEXT_ONLY = (config.openai?.strictContextOnly ?? true) === true; // respects explicit false
const MAX_OUTPUT_TOKENS = config.openai?.maxOutputTokens || 220;

const CONTEXT_FILE = path.join(__dirname, '..', 'data', 'context.md');
const CONTEXT_DIR  = process.env.CONTEXT_DIR  || ''; // e.g., data/context

// Chunking/retrieval knobs
const CHUNK_MAX_CHARS = parseNumber(1200);
const TOP_K           = parseNumber(5);
const MIN_SCORE       = parseNumber(0.18);
const CACHE_TTL_MS    = parseNumber(1000 * 60 * 60 * 6); // 6h
const CACHE_MAX       = parseNumber(500);
const DEBUG_AI        = parseBool(false);

/* ------------------------ MINI LRU CACHE ------------------------ */
class LRUCache {
  constructor(max = CACHE_MAX, ttl = CACHE_TTL_MS) { this.max = max; this.ttl = ttl; this.map = new Map(); }
  _now() { return Date.now(); }
  get(key) {
    const it = this.map.get(key);
    if (!it) return null;
    if (this._now() > it.exp) { this.map.delete(key); return null; }
    this.map.delete(key); this.map.set(key, it); // bump recency
    return it.value;
  }
  set(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, { value, exp: this._now() + this.ttl });
    if (this.map.size > this.max) this.map.delete(this.map.keys().next().value);
  }
  clear() { this.map.clear(); }
}
const answerCache = new LRUCache();

/* ------------------------ CONTEXT LOADING ------------------------ */
let CONTEXT_CHUNKS = [];
let CONTEXT_HASH = '';

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf-8'); }
  catch { return ''; }
}
function readDirConcatenated(dir) {
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(md|txt)$/i.test(f))
      .map(f => path.join(dir, f));
    return files.map(readFileSafe).filter(Boolean).join('\n\n');
  } catch { return ''; }
}
function loadRawContext() {
  const byDir = CONTEXT_DIR ? readDirConcatenated(CONTEXT_DIR) : '';
  if (byDir.trim()) return byDir;
  return readFileSafe(CONTEXT_FILE);
}
// Split content by double newlines, then re-chunk to ~CHUNK_MAX_CHARS
function chunkContext(raw) {
  const parts = String(raw || '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/g)
    .map(s => s.trim())
    .filter(Boolean);

  const chunks = [];
  let buf = '';
  for (const p of parts) {
    if ((buf + '\n\n' + p).length <= CHUNK_MAX_CHARS) {
      buf = buf ? (buf + '\n\n' + p) : p;
    } else {
      if (buf) chunks.push(buf);
      if (p.length <= CHUNK_MAX_CHARS) {
        buf = p;
      } else {
        for (let i = 0; i < p.length; i += CHUNK_MAX_CHARS) {
          chunks.push(p.slice(i, i + CHUNK_MAX_CHARS));
        }
        buf = '';
      }
    }
  }
  if (buf) chunks.push(buf);
  return chunks;
}
function digestContext(chunks) {
  return crypto.createHash('sha1').update(chunks.join('\n')).digest('hex').slice(0, 8);
}
function loadContext() {
  const raw = loadRawContext();
  CONTEXT_CHUNKS = raw ? chunkContext(raw) : [];
  CONTEXT_HASH = digestContext(CONTEXT_CHUNKS);
  if (DEBUG_AI) {
    console.log('[AI] Context loaded:', {
      file: CONTEXT_FILE,
      dir: CONTEXT_DIR || null,
      rawLen: raw ? raw.length : 0,
      chunks: CONTEXT_CHUNKS.length,
      contextHash: CONTEXT_HASH,
      firstChunkPreview: CONTEXT_CHUNKS[0]?.slice(0, 160)
    });
  }

  // COMPREHENSIVE LOGGING - Show ALL data
  console.log('=== COMPLETE CONTEXT DATA DUMP ===');
  console.log('File path:', CONTEXT_FILE);
  console.log('Raw context length:', raw ? raw.length : 0);
  console.log('Raw context content:');
  console.log(raw || 'NO CONTENT LOADED');
  console.log('---');
  console.log('Context chunks count:', CONTEXT_CHUNKS.length);
  console.log('Context hash:', CONTEXT_HASH);
  console.log('---');
  console.log('ALL CHUNKS:');
  CONTEXT_CHUNKS.forEach((chunk, index) => {
    console.log(`\n--- CHUNK ${index + 1} ---`);
    console.log(`Length: ${chunk.length} characters`);
    console.log(`Content: ${chunk}`);
  });
  console.log('=== END CONTEXT DUMP ===');
}
loadContext();

/** Programmatic update (e.g., after admin save) */
const setContextFromString = (raw) => {
  CONTEXT_CHUNKS = raw ? chunkContext(String(raw)) : [];
  CONTEXT_HASH = digestContext(CONTEXT_CHUNKS);
  answerCache.clear(); // invalidate old answers
  if (DEBUG_AI) console.log('[AI] Context updated. New hash:', CONTEXT_HASH, 'Chunks:', CONTEXT_CHUNKS.length);
};

/* ------------------------ SIMPLE SIMILARITY ------------------------ */
const normalize = (s) => String(s || '')
  .toLowerCase()
  .replace(/[^\p{L}\p{N}\s]/gu, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const tokenize = (s) => normalize(s).split(' ').filter(Boolean);

function phraseOverlapBonus(a, b) {
  const A = tokenize(a); const B = tokenize(b);
  if (A.length < 2 || B.length < 2) return 0;
  const bigrams = (t) => t.map((_, i) => t.slice(i, i + 2).join(' ')).filter(x => x.split(' ').length === 2);
  const BA = new Set(bigrams(A)); const BB = new Set(bigrams(B));
  let inter = 0; for (const g of BA) if (BB.has(g)) inter++;
  return Math.min(0.25, inter / Math.max(BA.size, BB.size) * 0.25);
}
function similarity(a, b) {
  const ta = new Set(tokenize(a));
  const tb = new Set(tokenize(b));
  if (!ta.size || !tb.size) return 0;
  const inter = [...ta].filter(w => tb.has(w)).length;
  const union = new Set([...ta, ...tb]).size;
  const jaccard = inter / union;
  return Math.min(1, jaccard * 0.85 + phraseOverlapBonus(a, b) * 0.15);
}
function topKChunks(query, k = TOP_K, minScore = MIN_SCORE) {
  console.log('=== SIMILARITY SEARCH DEBUG ===');
  console.log('Query:', query);
  console.log('Total chunks available:', CONTEXT_CHUNKS.length);
  console.log('TOP_K:', k);
  console.log('MIN_SCORE:', minScore);

  const scored = CONTEXT_CHUNKS.map((c, i) => ({ i, c, score: similarity(query, c) }));
  console.log('All chunk scores:');
  scored.forEach((item, index) => {
    console.log(`Chunk ${index + 1}: Score = ${item.score.toFixed(4)}, Preview: ${item.c.substring(0, 100)}...`);
  });

  scored.sort((a, b) => b.score - a.score);
  console.log('Sorted scores (descending):');
  scored.forEach((item, index) => {
    console.log(`Rank ${index + 1}: Score = ${item.score.toFixed(4)}, Chunk ${item.i + 1}`);
  });

  const filtered = scored.filter(s => s.score >= minScore).slice(0, k);
  console.log('Filtered results (above minScore):', filtered.length);

  const result = filtered.length ? filtered : (scored[0] ? [scored[0]] : []);
  console.log('Final selected chunks:', result.length);
  result.forEach((item, index) => {
    console.log(`Selected ${index + 1}: Score = ${item.score.toFixed(4)}, Content: ${item.c.substring(0, 150)}...`);
  });
  console.log('=== END SIMILARITY SEARCH ===');

  if (DEBUG_AI) {
    console.log('[AI] Retrieval:',
      { query, totalChunks: CONTEXT_CHUNKS.length, selected: result.length, topScore: scored[0]?.score?.toFixed(3) });
  }
  return result;
}

/* ------------------------ OPENAI (Responses API) ------------------------ */
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

async function callOpenAI({ message, contextSnippets }) {
  if (!openai) throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'AI service unavailable');

  const systemText =
    'You are a helpful assistant for a university event portal. ' +
    'Answer strictly and only using the provided CONTEXT. If the answer is not clearly present, say you do not have enough information. ' +
    'Be concise and actionable.';

  const ctx = contextSnippets.map((s, i) => `Snippet ${i + 1}:\n${s}`).join('\n\n');
  const userText =
    `CONTEXT (authoritative):\n${ctx}\n\nQUESTION: ${message}\n\n` +
    ((STRICT_CONTEXT_ONLY === true)
      ? 'RULE: If the context does not contain the answer, reply: "I don’t have that information in the provided context."'
      : 'Prefer answers grounded in context; if partial, state what is missing.');

  const MAX_PROMPT_CHARS = 3000;
  const clipped = userText.length > MAX_PROMPT_CHARS ? userText.slice(0, MAX_PROMPT_CHARS) : userText;

  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

  const backoff = async (fn) => {
    try { return await fn(); }
    catch (e) {
      const s = e.status || e.code;
      if (s === 429 || (s >= 500 && s < 600)) {
        await new Promise(r => setTimeout(r, 300 + Math.floor(Math.random() * 400)));
        return fn();
      }
      throw e;
    }
  };

  try {
    let text, usage;

    // Preferred path: Responses API (standard going forward)
    if (openai.responses && typeof openai.responses.create === 'function') {
      const resp = await backoff(() => openai.responses.create({
        model: OPENAI_MODEL,              // e.g., 'gpt-5-mini' (default) or override via env
        temperature: 0.1,
        max_output_tokens: MAX_OUTPUT_TOKENS,
        input: [
          { role: 'system', content: [{ type: 'input_text', text: systemText }] },
          { role: 'user',   content: [{ type: 'input_text', text: clipped }] }
        ]
      }, { signal: controller.signal }));

      text = resp.output_text ?? '';
      usage = resp.usage ?? null;

    } else {
      // Legacy fallback: Chat Completions (for older SDKs/environments)
      const fallbackModel = (OPENAI_MODEL.includes('gpt-5-mini')) ? 'gpt-4o-mini' : OPENAI_MODEL;
      const resp = await backoff(() => openai.chat.completions.create({
        model: fallbackModel,
        temperature: 0.1,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [
          { role: 'system', content: systemText },
          { role: 'user',   content: clipped }
        ]
      }, { signal: controller.signal }));

      text = resp.choices?.[0]?.message?.content ?? '';
      usage = resp.usage ?? null;
    }

    return { text, usage };
  } catch (error) {
    if (error.name === 'AbortError') throw new ApiError(httpStatus.REQUEST_TIMEOUT, 'AI response timed out');
    // Don’t leak prompts or snippets in prod logs
    console.error('[AI] OpenAI error:', { name: error?.name, status: error?.status || error?.code, msg: error?.message });
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get AI response');
  } finally {
    clearTimeout(to);
  }
}


/* ------------------------ PUBLIC API ------------------------ */
/**
 * Chat with AI using context-based retrieval.
 * @param {Object} options
 * @param {string} options.message
 * @returns {Promise<{source:string, answer:string, contextHash:string, usage?:any, cached?:boolean}>}
 */
const chatWithContext = async ({ message }) => {
  const q = String(message || '').trim();
  if (!q) throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide a question');

  if (!CONTEXT_CHUNKS.length) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Knowledge base not loaded');
  }

  // Cache key = (normalized question + context hash) to avoid stale answers after updates
  const key = crypto.createHash('sha1')
    .update(`${normalize(q)}|${CONTEXT_HASH}`)
    .digest('hex');

  const cached = answerCache.get(key);
  if (cached) return { ...cached, cached: true };

  // Retrieve top-K relevant context slices
  const snippets = topKChunks(q, TOP_K, MIN_SCORE).map(s => s.c);

  // Call LLM with only small set of snippets
  const { text, usage } = await callOpenAI({ message: q, contextSnippets: snippets });

  const payload = {
    source: 'context+llm',
    answer: text || (STRICT_CONTEXT_ONLY
      ? 'I don’t have that information in the provided context.'
      : 'Sorry, I’m not sure from the current context.'),
    contextHash: CONTEXT_HASH,
    usage
  };
  answerCache.set(key, payload);
  return payload;
};

module.exports = {
  chatWithContext,
  setContextFromString
};
