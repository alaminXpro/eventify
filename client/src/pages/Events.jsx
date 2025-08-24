
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import api from "../utils/axiosInstance";

/* =========================================
   Icons
========================================= */
const CalendarIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c1.1 0 2 .9 2 2h14c1.1 0 2-.9 2-2V5c-1.1 0-2-.9-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
  </svg>
);
const LocationIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const PlusIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
  </svg>
);

/* =========================================
   Helpers
========================================= */
const now = () => Date.now();

const toMonthDay = (isoOrDate) => {
  const d = isoOrDate ? new Date(isoOrDate) : null;
  if (!d || isNaN(d)) return { month: "", day: "" };
  return {
    month: d.toLocaleString(undefined, { month: "short" }).toUpperCase(),
    day: String(d.getDate()).padStart(2, "0"),
  };
};

// include backend field event_date first
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
  const { month, day } = toMonthDay(startsAt);

  const dateStr = startsAt
    ? new Date(startsAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "";

  const timeStr = startsAt
    ? new Date(startsAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : "";

  const startsAtMs = startsAt ? new Date(startsAt).getTime() : null;
  const isPast = startsAtMs ? startsAtMs < now() : false;

  return {
    id: e.id || e._id || e.event_id,
    title: e.title || e.name || "Untitled Event",
    image: e.event_image || e.bannerUrl || e.banner_url || e.image || e.cover || "",
    category: e.category || e.event_type || "General",
    date: dateStr,
    time: timeStr,
    month,
    day,
    location: e.location || e.venue || "TBA",
    maxCapacity: e.capacity ?? e.maxCapacity ?? e.max_capacity ?? 0,
    registeredCount: e.registered ?? e.registeredCount ?? e.total_registrations ?? e.attendees_count ?? 0,
    createdAt: e.createdAt || e.created_at || e.publishedAt || startsAt,
    startsAtMs,                 // ← keep raw start for logic
    isPast,                     
    _raw: e,
  };
};

/* =========================================
   Card
========================================= */
const EventCard = ({ event, onRegister, disabled }) => {
  const spotsLeft = Math.max(0, (event.maxCapacity ?? 0) - (event.registeredCount ?? 0));
  const denom = Math.max(1, event.maxCapacity ?? 1);
  const fillPercentage = Math.min(100, Math.max(0, ((event.registeredCount ?? 0) / denom) * 100));
  const statusTone = spotsLeft === 0 ? "text-red-400" : spotsLeft <= 10 ? "text-orange-300" : "text-emerald-400";
  const brandGrad = "bg-gradient-to-r from-indigo-500 to-violet-500";
  const brandGradSoft = "bg-gradient-to-r from-indigo-400 to-violet-400";

  const btnDisabled = disabled || spotsLeft === 0 || event.isPast;

  // subtle visual for past events
  const pastClasses = event.isPast ? "opacity-60 saturate-50" : "";

  return (
    <motion.article
      layout
      role="article"
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-950 to-slate-900 shadow-md ${pastClasses}`}
      whileHover={{ y: event.isPast ? 0 : -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.6 }}
      aria-disabled={event.isPast ? "true" : "false"}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 blur-[2px] transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "linear-gradient(120deg,transparent,rgba(99,102,241,0.25),rgba(139,92,246,0.25),transparent)" }}
      />

      <div className="relative h-44 overflow-hidden">
        <motion.img
          src={event.image}
          alt=""
          className="h-full w-full object-cover"
          whileHover={{ scale: event.isPast ? 1 : 1.06 }}
          transition={{ duration: 0.45 }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />

        <div className="absolute left-3 top-3">
          <motion.span
            className={`rounded-md ${brandGrad} px-2 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur`}
            whileHover={{ scale: event.isPast ? 1 : 1.05 }}
            transition={{ duration: 0.15 }}
          >
            {event.category}
          </motion.span>
        </div>

        <motion.div
          className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-center shadow-sm backdrop-blur"
          whileHover={{ scale: event.isPast ? 1 : 1.05 }}
          transition={{ duration: 0.15 }}
        >
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
              animate={{ width: `${Math.max(0, Math.min(100, fillPercentage))}%` }}
              transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Important: prevent card Link navigation */}
        <motion.button
          onClick={(ev) => {
            ev.preventDefault(); ev.stopPropagation();
            if (!event.isPast) onRegister?.(event);
          }}
          className={`relative mt-auto w-full overflow-hidden rounded-xl py-2 px-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            btnDisabled
              ? "cursor-not-allowed bg-slate-700/60 text-slate-500"
              : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-500"
          }`}
          disabled={btnDisabled}
          whileHover={!btnDisabled ? { scale: 1.02 } : {}}
          whileTap={!btnDisabled ? { scale: 0.98 } : {}}
          title={event.isPast ? "This event has ended" : undefined}
        >
          {event.isPast ? "Event Ended" : (btnDisabled ? "Registered" : "Quick Register")}
        </motion.button>
      </div>
    </motion.article>
  );
};

/* =========================================
   Page: All Events
========================================= */
const Events = () => {
  const navigate = useNavigate();
  const PAGE_SIZE = 12;
  const prefersReducedMotion = useReducedMotion();

  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("upcoming");
  const [page, setPage] = useState(1);

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);

  // Track registered events to disable button
  const [registeredIds, setRegisteredIds] = useState(new Set());

  const loadMoreRef = useRef(null);

  // role for create button (keep your logic)
  const [role] = useState(() => {
    try {
      const persisted = localStorage.getItem("persist:root");
      if (!persisted) return null;
      const parsed = JSON.parse(persisted);
      const userState = JSON.parse(parsed.user || "{}");
      return userState?.currentUser?.role || null;
    } catch {
      return null;
    }
  });

  // current user id for registration API
  const userId = useMemo(() => {
    try {
      const persisted = localStorage.getItem("persist:root");
      if (!persisted) return null;
      const parsed = JSON.parse(persisted);
      const userState = JSON.parse(parsed.user || "{}");
      return userState?.currentUser?._id || userState?.currentUser?.id || null;
    } catch {
      return null;
    }
  }, []);

  // Debounce search input (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Sort mapping compatible with backend
  const sortParam = useMemo(() => {
    switch (sortBy) {
      case "popular":  return "total_registrations:desc";
      case "newest":   return "created_at:desc";
      case "capacity": return "capacity:desc";
      case "upcoming":
      default:         return "event_date:asc";
    }
  }, [sortBy]);

  // Fetch events
  useEffect(() => {
    const controller = new AbortController();
    const isFirstPage = page === 1;

    async function fetchEvents() {
      if (isFirstPage) { setLoading(true); setError(""); } else { setLoadingMore(true); }

      try {
        const params = {
          title: debouncedQ || undefined,
          category: activeCategory !== "All" ? activeCategory : undefined,
          sortBy: sortParam,
          page,
          limit: PAGE_SIZE,
        };

        const res = await api.get("/events/published", { params, signal: controller.signal });
        const payload = res?.data;

        let items = [];
        let total;
        let hasMoreFromApi;

        if (payload && typeof payload === "object") {
          if (Array.isArray(payload.results)) {
            items = payload.results;
            total = payload.totalResults ?? payload.total;
          } else if (Array.isArray(payload.items)) {
            items = payload.items;
            hasMoreFromApi = payload?.pagination?.hasMore;
            total = payload?.pagination?.total;
          } else if (Array.isArray(payload.data)) {
            items = payload.data;
          }
        } else if (Array.isArray(payload)) {
          items = payload;
        }

        const adapted = items.map(adaptEvent).filter((e) => e.id);
        setEvents((prev) => (isFirstPage ? adapted : [...prev, ...adapted]));

        // Derive categories from loaded data
        setCategories((prev) => {
          const set = new Set(prev.includes("All") ? prev : ["All", ...prev]);
          adapted.forEach((e) => e.category && set.add(e.category));
          return Array.from(set);
        });

        // hasMore
        if (typeof hasMoreFromApi === "boolean") {
          setHasMore(hasMoreFromApi);
        } else if (typeof total === "number") {
          const countSoFar = isFirstPage ? adapted.length : (events.length + adapted.length);
          setHasMore(countSoFar < total);
        } else {
          setHasMore(adapted.length === PAGE_SIZE);
        }
      } catch (err) {
        if (err?.name !== "CanceledError" && err?.name !== "AbortError") {
          setError("Couldn't load events. Please try again.");
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }

    fetchEvents();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, activeCategory, sortBy, page]);

  // Fetch registered history (to disable buttons)
  useEffect(() => {
    if (!userId) return;
    let ignore = false;
    (async () => {
      try {
        const { data } = await api.get(`/events/user/${userId}/history`, { params: { status: "registered", limit: 200 } });
        if (ignore || !data) return;
        const list = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);
        const idSet = new Set(list.map((h) => h?.event?._id || h?.event?.id || h?.event));
        setRegisteredIds(idSet);
      } catch {
        // non-blocking
      }
    })();
    return () => { ignore = true; };
  }, [userId]);

  // Reset to page 1 whenever filters change (except page itself)
  useEffect(() => {
    setPage(1);
  }, [debouncedQ, activeCategory, sortBy]);

  // Quick Register handler
  const onRegister = async (event) => {
    if (!userId) {
      navigate("/login");
      return;
    }
    if (event.isPast || registeredIds.has(event.id)) return;

    // optimistic: disable and bump count locally
    setRegisteredIds((s) => new Set(s).add(event.id));
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, registeredCount: (e.registeredCount || 0) + 1 } : e))
    );

    try {
      await api.post("/events/register", { userId, eventId: event.id });
      // success: nothing else to do
    } catch (err) {
      // rollback on failure
      setRegisteredIds((s) => {
        const n = new Set(s);
        n.delete(event.id);
        return n;
      });
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, registeredCount: Math.max(0, (e.registeredCount || 1) - 1) } : e))
      );
      alert(err?.response?.data?.message || "Registration failed.");
    }
  };

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    setPage((p) => p + 1);
  };

  // Infinite scroll
  useEffect(() => {
    if (prefersReducedMotion) return;
    const node = loadMoreRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && loadMore()),
      { rootMargin: "600px 0px 600px 0px", threshold: 0.01 }
    );
    io.observe(node);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, prefersReducedMotion, loadingMore]);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };
  const item = { hidden: { opacity: 0, y: 12, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 18 } } };

  return (
    <section className="relative min-h-screen bg-[#0b1220] py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="inline-flex bg-gradient-to-r from-indigo-300 via-white to-violet-300 bg-clip-text text-3xl font-black text-transparent md:text-4xl">All Events</h1>
            <p className="mt-2 text-slate-400">Search, filter and discover everything happening.</p>
          </div>

          {role == "moderator" ? (
            <Link
              to="/events/create"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow hover:from-indigo-500 hover:to-violet-600"
            >
              <PlusIcon className="h-4 w-4" />
              Create Event
            </Link>
          ) : null}
        </div>

        {/* Sticky Controls */}
        <div className="sticky top-2 z-20 mb-8 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40 p-3 shadow-sm">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, place, category..."
                className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
                aria-label="Search events"
              />
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
              </svg>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                    activeCategory === cat ? "bg-indigo-600 text-white" : "bg-slate-800/70 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="sortBy">Sort events</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
              >
                <option value="upcoming">Upcoming</option>
                <option value="popular">Most popular</option>
                <option value="newest">Newest</option>
                <option value="capacity">Largest capacity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-6 text-red-300">{error || "Something went wrong."}</div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-10 text-center">
            <p className="text-slate-300">No events match your filters.</p>
            <Link
              to="/events/create"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4" />
              Create the first event
            </Link>
          </div>
        ) : (
          <>
            <motion.div
              layout
              variants={prefersReducedMotion ? undefined : container}
              initial={prefersReducedMotion ? false : "hidden"}
              animate={prefersReducedMotion ? undefined : "show"}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {events.map((e) => (
                <motion.div key={e.id} variants={prefersReducedMotion ? undefined : item}>
                  <Link to={`/events/${e.id}`} state={{ event: e }} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:rounded-2xl">
                    <EventCard
                      event={e}
                      onRegister={onRegister}
                      disabled={registeredIds.has(e.id)}
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <motion.button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </motion.button>
              </div>
            )}
            {hasMore && <div ref={loadMoreRef} className="h-2 w-full" aria-hidden />}
          </>
        )}
      </div>

      {/* Floating Create FAB for mobile */}
      <Link
        to="/events/create"
        className="fixed bottom-6 right-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white shadow-lg hover:from-indigo-500 hover:to-violet-600 sm:hidden"
        aria-label="Create Event"
      >
        <PlusIcon className="h-6 w-6" />
      </Link>

      {/* page bg accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(700px 260px at 15% 85%, rgba(99,102,241,0.25) 0%, transparent 60%), radial-gradient(700px 260px at 85% 15%, rgba(139,92,246,0.25) 0%, transparent 60%)",
          }}
          aria-hidden
        />
      </div>
    </section>
  );
};

/* Skeleton (with shimmer) */
const SkeletonCard = () => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900">
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

export default Events;
