// src/components/EventsShowcase.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../utils/axiosInstance";

/* ---------- Icons ---------- */
const CalendarIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
  </svg>
);
const LocationIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

/* ---------- helpers ---------- */
const now = () => Date.now();
const toMonthDay = (isoOrDate) => {
  const d = isoOrDate ? new Date(isoOrDate) : null;
  if (!d || isNaN(d)) return { month: "", day: "" };
  return {
    month: d.toLocaleString(undefined, { month: "short" }).toUpperCase(),
    day: String(d.getDate()).padStart(2, "0"),
  };
};
const getStartDate = (e) =>
  e?.event_date ||
  e?.startsAt ||
  e?.startAt ||
  e?.start_time ||
  e?.startTime ||
  e?.start_date ||
  e?.startDate ||
  e?.date;

const adaptEvent = (e) => {
  const startsAt = getStartDate(e);
  const startsAtMs = startsAt ? new Date(startsAt).getTime() : null;
  const { month, day } = toMonthDay(startsAt);

  const dateStr = startsAt
    ? new Date(startsAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "";
  const timeStr = startsAt
    ? new Date(startsAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : "";

  return {
    id: e.id || e._id || e.event_id,
    title: e.title || e.name || "Untitled Event",
    image:
      e.event_image ||
      e.bannerUrl ||
      e.banner_url ||
      e.image ||
      e.cover ||
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=60",
    category: e.category || e.event_type || "General",
    date: dateStr,
    time: timeStr,
    month,
    day,
    location: e.location || e.venue || "TBA",
    maxCapacity: e.capacity ?? e.maxCapacity ?? e.max_capacity ?? 0,
    registeredCount: e.registered ?? e.registeredCount ?? e.total_registrations ?? e.attendees_count ?? 0,
    startsAtMs,
    isPast: startsAtMs ? startsAtMs < now() : false,
    _raw: e,
  };
};

/* ---------- Card ---------- */
const EventCard = ({ event, onRegister }) => {
  const denom = Math.max(1, event.maxCapacity ?? 1);
  const spotsLeft = Math.max(0, (event.maxCapacity ?? 0) - (event.registeredCount ?? 0));
  const fillPercentage = Math.min(100, Math.max(0, ((event.registeredCount ?? 0) / denom) * 100));
  const statusTone = spotsLeft === 0 ? "text-red-400" : spotsLeft <= 10 ? "text-orange-300" : "text-emerald-400";
  const brandGrad = "bg-gradient-to-r from-indigo-500 to-violet-500";
  const brandGradSoft = "bg-gradient-to-r from-indigo-400 to-violet-400";

  return (
    <motion.div
      role="article"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-950 to-slate-900 shadow-md"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 blur-[2px] transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "linear-gradient(120deg,transparent,rgba(99,102,241,0.25),rgba(139,92,246,0.25),transparent)" }}
      />

      <div className="relative h-44 overflow-hidden">
        <motion.img src={event.image} alt="" className="h-full w-full object-cover" whileHover={{ scale: 1.07 }} transition={{ duration: 0.4 }} loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />

        <div className="absolute left-3 top-3">
          <motion.span className={`rounded-md ${brandGrad} px-2 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur`} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            {event.category}
          </motion.span>
        </div>

        <motion.div className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-center shadow-sm backdrop-blur" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <div className="text-[10px] font-semibold leading-3 text-slate-600">{event.month}</div>
          <div className="text-sm font-black text-slate-900">{event.day}</div>
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-slate-50 transition-colors duration-300 group-hover:text-indigo-200">
          {event.title}
        </h3>

        <div className="mb-3 flex-1 space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <CalendarIcon className="h-4 w-4 flex-shrink-0 text-indigo-300" />
            <span className="truncate">{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <LocationIcon className="h-4 w-4 flex-shrink-0 text-indigo-300" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Spots</span>
            <span className={`text-xs font-semibold ${statusTone}`}>
              {event.maxCapacity ? (spotsLeft > 0 ? `${spotsLeft} left` : "Full") : "—"}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/50">
            <motion.div
              className={`h-1.5 rounded-full ${spotsLeft === 0 ? "bg-slate-600" : brandGradSoft}`}
              initial={{ width: 0 }}
              animate={{ width: `${fillPercentage}%` }}
              transition={{ duration: 1, delay: 0.1 }}
            />
          </div>
        </div>

        <motion.button
          onClick={() => onRegister?.(event)}
          className={`relative mt-auto w-full overflow-hidden rounded-xl py-2 px-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            spotsLeft === 0 ? "cursor-not-allowed bg-slate-700/60 text-slate-500" : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-500"
          }`}
          disabled={spotsLeft === 0}
          whileHover={spotsLeft > 0 ? { scale: 1.02 } : {}}
          whileTap={spotsLeft > 0 ? { scale: 0.98 } : {}}
        >
          {spotsLeft === 0 ? "Event Full" : "Quick Register"}
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ---------- Skeleton ---------- */
const Skeleton = () => (
  <div className="relative w-[320px] flex-shrink-0 overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/60">
    <div className="h-44 w-full bg-slate-800/60" />
    <div className="space-y-3 p-4">
      <div className="h-5 w-3/4 rounded bg-slate-800/60" />
      <div className="h-4 w-2/3 rounded bg-slate-800/60" />
      <div className="h-4 w-1/2 rounded bg-slate-800/60" />
      <div className="h-2 w-full rounded bg-slate-800/60" />
      <div className="h-9 w-full rounded-xl bg-slate-800/60" />
    </div>
    <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    <style>{`@keyframes shimmer{100%{transform:translateX(100%)}}`}</style>
  </div>
);

/* ---------- Showcase (only upcoming) ---------- */
const EventsShowcase = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const DISPLAY_LIMIT = 12;

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get("/events/published", {
          params: { page: 1, limit: DISPLAY_LIMIT * 2, sortBy: "created_at:desc" },
          signal: controller.signal,
        });

        let items = [];
        const payload = res?.data;
        if (payload && typeof payload === "object") {
          if (Array.isArray(payload.results)) items = payload.results;
          else if (Array.isArray(payload.items)) items = payload.items;
          else if (Array.isArray(payload.data)) items = payload.data;
        } else if (Array.isArray(payload)) items = payload;

        const adapted = items.map(adaptEvent).filter((e) => e.id);
        if (!ignore) setRows(adapted);
      } catch (e) {
        if (!ignore && e?.name !== "CanceledError" && e?.name !== "AbortError") {
          setErr("Couldn't load events.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; controller.abort(); };
  }, []);

  // Only upcoming (not over) + sort by soonest
  const upcoming = useMemo(() => {
    return rows
      .filter((e) => !e.isPast)
      .sort((a, b) => {
        if (a.startsAtMs && b.startsAtMs) return a.startsAtMs - b.startsAtMs;
        if (a.startsAtMs) return -1;
        if (b.startsAtMs) return 1;
        return 0;
      })
      .slice(0, DISPLAY_LIMIT);
  }, [rows]);

  // duplicate list for seamless marquee
  const marqueeItems = useMemo(() => (upcoming.length ? upcoming.concat(upcoming) : []), [upcoming]);

  const handleRegister = () => {};

  return (
    <section className="relative overflow-hidden bg-[#0b1220] py-16">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(700px 260px at 15% 85%, rgba(99,102,241,0.25) 0%, transparent 60%), radial-gradient(700px 260px at 85% 15%, rgba(139,92,246,0.25) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="container relative mx-auto max-w-7xl px-6">
        <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-2 bg-gradient-to-r from-indigo-300/90 to-violet-300/90 bg-clip-text text-sm font-semibold uppercase tracking-wider text-transparent">
            Featured Events
          </p>
          <h2 className="text-4xl font-black text-white md:text-5xl">
            Upcoming <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Events</span>
          </h2>
        </motion.div>

        <div
          className="marquee group relative w-full overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%)",
            maskImage: "linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%)",
          }}
        >
          <div className="track flex gap-6 will-change-transform">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={`sk-${i}`} />)
              : err
              ? <div className="text-slate-300">{err}</div>
              : marqueeItems.length === 0
              ? <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 text-slate-300">No upcoming events.</div>
              : marqueeItems.map((e, i) => (
                  <div key={`${e.id}-${i}`} className="w-[320px] flex-shrink-0">
                    <Link to={`/events/${e.id}`} state={{ event: e }}>
                      <EventCard event={e} onRegister={handleRegister} />
                    </Link>
                  </div>
                ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-x { 0% { transform:translateX(0%);} 100% { transform:translateX(-50%);} }
        .marquee .track { animation: scroll-x 28s linear infinite; }
        .marquee:hover .track { animation-play-state: paused; }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
      `}</style>
    </section>
  );
};

export default EventsShowcase;
