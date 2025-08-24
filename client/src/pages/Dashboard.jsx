// src/pages/StudentDashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Search,
  X,
  ChevronRight,
  MapPin,
  ListChecks,
  User2,
  CheckCircle2,
  Clock3,
  Award,
  SlidersHorizontal,
  ArrowUpDown,
  Loader2,
} from "lucide-react";


export default function StudentDashboard() {
  const API_BASE = import.meta.env.VITE_API_BASE; // e.g., http://localhost:3000/v1

  // Replace with Redux or your auth context: useSelector((s) => s.user.user)
  const [user] = useState({
    name: "Alex Student",
    email: "alex@student.edu",
  });

  // UI state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | registered | waitlist | attended | cancelled | pending
  const [sortBy, setSortBy] = useState("upcoming"); // upcoming | recent | az
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Data state
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);
  const [myEvents, setMyEvents] = useState([]);

  // Demo seed (remove when wired)
  const DEMO = useMemo(
    () => [
      {
        id: "e1",
        title: "Annual Sports Tournament",
        date: "2026-04-12T08:00:00Z",
        location: "Sports Complex",
        status: "registered",
        cover:
          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=60",
      },
      {
        id: "e2",
        title: "Tech Innovation Summit",
        date: "2026-03-15T09:00:00Z",
        location: "Main Auditorium",
        status: "attended",
        cover:
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=60",
      },
      {
        id: "e3",
        title: "Startup Pitch Night",
        date: "2026-03-28T14:00:00Z",
        location: "Business Hall",
        status: "waitlist",
        cover:
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop&q=60",
      },
      {
        id: "e4",
        title: "Green Campus Workshop",
        date: "2026-05-05T10:00:00Z",
        location: "Science Building",
        status: "registered",
        cover:
          "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=60",
      },
      {
        id: "e5",
        title: "Art & Design Exhibition",
        date: "2026-04-18T15:00:00Z",
        location: "Art Gallery",
        status: "cancelled",
        cover:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&auto=format&fit=crop&q=60",
      },
    ],
    []
  );

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    setError("");

    // TODO: BACKEND — fetch the student's registered events

    // Demo:
    const t = setTimeout(() => {
      setMyEvents(DEMO);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, [API_BASE, DEMO]);

  // Derived: stats
  const stats = useMemo(() => {
    const now = Date.now();
    const total = myEvents.length;
    const attended = myEvents.filter((e) => (e.status || "").toLowerCase() === "attended").length;
    const upcoming = myEvents.filter((e) => new Date(e.date).getTime() > now).length;
    return { total, attended, upcoming };
  }, [myEvents]);

  // Filter + sort
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = myEvents.filter((e) => {
      const matchesQ =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.location || "").toLowerCase().includes(q) ||
        (e.status || "").toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" || (e.status || "").toLowerCase() === statusFilter;
      return matchesQ && matchesStatus;
    });

    switch (sortBy) {
      case "az":
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recent":
        list = [...list].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      default: // upcoming first
        list = [...list].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }

    return list;
  }, [myEvents, search, statusFilter, sortBy]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    setLoadingMore(true);
    // If you page from backend, call it here and append results instead:
    // TODO: BACKEND — pagination
    // fetch(`${API_BASE}/students/me/events?limit=${PAGE_SIZE}&page=${page + 1}`, { credentials: "include" })
    //   .then(r => r.json())
    //   .then(data => setMyEvents(prev => [...prev, ...(data.items ?? data)]))
    //   .finally(() => setLoadingMore(false));
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoadingMore(false);
    }, 300);
  }, [hasMore]);

  const handleUnregister = async (eventId) => {
    const prev = myEvents;
    setMyEvents((list) => list.filter((e) => e.id !== eventId)); // optimistic
    setNotice("Unregistered from event"); // lightweight feedback
    setTimeout(() => setNotice(""), 2000);

    try {
      // TODO: BACKEND — unregister endpoint
    } catch (err) {
      // revert on error
      setMyEvents(prev);
      setError(err?.message || "Failed to unregister");
    }
  };

  return (
    <section className="min-h-screen bg-[#0b1220] text-slate-100">
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div
            className="h-[260px] w-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220]/30 via-[#0b1220]/60 to-[#0b1220]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-10 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 ring-4 ring-white/5 grid place-items-center">
                <ListChecks className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black md:text-3xl">
                  Hey,{" "}
                  <span className="bg-gradient-to-r from-indigo-300 via-white to-violet-300 bg-clip-text text-transparent">
                    {user.name}
                  </span>
                </h1>
                <p className="mt-1 text-sm text-slate-300">
                  Track your registrations and keep up with upcoming events.
                </p>
              </div>
            </div>

            {/* Quick Nav: Profile link as pill */}
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold hover:bg-slate-800/70"
            >
              <User2 className="h-4 w-4" />
              Profile
            </Link>
          </div>

          {/* Stats summary */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard
              icon={<Clock3 className="h-4 w-4 text-indigo-300" />}
              label="Upcoming"
              value={stats.upcoming}
            />
            <StatCard
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-300" />}
              label="Registered"
              value={stats.total}
            />
            <StatCard
              icon={<Award className="h-4 w-4 text-violet-300" />}
              label="Attended"
              value={stats.attended}
            />
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search your events…"
                className="w-72 rounded-xl border border-slate-700/60 bg-slate-900/60 py-2 pl-9 pr-9 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
              />
              {search && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {["all", "registered", "waitlist", "attended"].map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      setStatusFilter(k);
                      setPage(1);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      statusFilter === k
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800/70 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {k[0].toUpperCase() + k.slice(1)}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="relative">
                <label htmlFor="sortBy" className="sr-only">
                  Sort by
                </label>
                <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
                  <ArrowUpDown className="h-4 w-4 text-slate-500" />
                </div>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="appearance-none rounded-xl border border-slate-700/60 bg-slate-900/60 pl-8 pr-8 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
                >
                  <option value="upcoming">Upcoming first</option>
                  <option value="recent">Newest first</option>
                  <option value="az">Title A–Z</option>
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                  <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-6 pb-14">
        {/* Inline banners */}
        {notice && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-200">
            {notice}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-900/20 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {loading ? (
          <SkeletonGrid />
        ) : visible.length === 0 ? (
          <EmptyState
            title={
              statusFilter === "all"
                ? "No registered events yet."
                : "No events match your filters."
            }
            cta="Browse events"
            to="/events"
          />
        ) : (
          <>
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.06, delayChildren: 0.04 },
                },
              }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            >
              {visible.map((e) => (
                <EventCard key={e.id} e={e} onUnregister={handleUnregister} />
              ))}
            </motion.div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-violet-600 disabled:opacity-60"
                >
                  {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loadingMore ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* bg accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(700px 260px at 12% 88%, rgba(99,102,241,0.25) 0%, transparent 60%), radial-gradient(700px 260px at 88% 12%, rgba(139,92,246,0.25) 0%, transparent 60%)",
          }}
          aria-hidden
        />
      </div>

      {/* tiny util for clamp without plugin */}
      <style>{`.line-clamp-2{-webkit-line-clamp:2;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}`}</style>
    </section>
  );
}

/* ===== Components ===== */

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">{label}</div>
        {icon}
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    registered:
      "bg-emerald-600/15 text-emerald-300 border-emerald-600/30 shadow-[0_0_0_1px_rgba(16,185,129,.15)]",
    pending:
      "bg-amber-600/15 text-amber-300 border-amber-600/30 shadow-[0_0_0_1px_rgba(245,158,11,.15)]",
    waitlist:
      "bg-sky-600/15 text-sky-300 border-sky-600/30 shadow-[0_0_0_1px_rgba(2,132,199,.15)]",
    cancelled:
      "bg-rose-600/15 text-rose-300 border-rose-600/30 shadow-[0_0_0_1px_rgba(244,63,94,.15)]",
    attended:
      "bg-indigo-600/15 text-indigo-300 border-indigo-600/30 shadow-[0_0_0_1px_rgba(99,102,241,.15)]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        map[status] ||
        "bg-slate-700/30 text-slate-300 border-slate-600/40 shadow-[0_0_0_1px_rgba(148,163,184,.15)]"
      }`}
    >
      {status}
    </span>
  );
}

function EventCard({ e, onUnregister }) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 14, scale: 0.98 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 220, damping: 18 },
        },
      }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 shadow-lg"
    >
      <div className="relative h-36 w-full overflow-hidden">
        <motion.img
          src={
            e.cover ||
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=60"
          }
          alt=""
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.45 }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/40 to-transparent" />
        <div className="absolute left-3 top-3">
          <StatusBadge status={(e.status || "registered").toLowerCase()} />
        </div>
      </div>

      <div className="p-4">
        <Link
          to={`/events/${e.id}`}
          state={{ event: e }}
          className="line-clamp-2 text-base font-bold text-slate-50 transition-colors hover:text-indigo-200"
        >
          {e.title}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-300">
          <CalendarDays className="h-4 w-4 text-indigo-300" />
          <span>{formatDate(e.date)}</span>
          {e.location && (
            <>
              <span className="text-slate-600">•</span>
              <MapPin className="h-4 w-4 text-indigo-300" />
              <span>{e.location}</span>
            </>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link
            to={`/events/${e.id}`}
            state={{ event: e }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700/60 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800/60"
          >
            Details <ChevronRight className="h-4 w-4" />
          </Link>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onUnregister?.(e.id)}
            className="rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-3 py-1.5 text-xs font-semibold text-white hover:from-rose-500 hover:to-pink-600"
          >
            Unregister
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

function EmptyState({ title, cta, to }) {
  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-10 text-center">
      <CalendarDays className="mx-auto mb-3 h-10 w-10 text-slate-500" />
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      {to && cta && (
        <Link
          to={to}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white hover:from-indigo-500 hover:to-violet-600"
        >
          {cta} <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60"
        >
          <div className="relative h-36 w-full bg-slate-800/50" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-3/4 rounded bg-slate-800/60" />
            <div className="h-4 w-1/2 rounded bg-slate-800/60" />
            <div className="h-9 w-full rounded-lg bg-slate-800/60" />
          </div>
          <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      ))}
      <style>{`@keyframes shimmer{100%{transform:translateX(100%)}}`}</style>
    </div>
  );
}

/* ===== Utils ===== */
function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}
