import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

/* =========================================
   Icons
========================================= */
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

/* =========================================
   Card
========================================= */
const EventCard = ({ event, onRegister }) => {
  const spotsLeft = event.maxCapacity - event.registeredCount;
  const fillPercentage = Math.min(100, Math.max(0, (event.registeredCount / event.maxCapacity) * 100));
  const statusTone = spotsLeft === 0 ? "text-red-400" : spotsLeft <= 10 ? "text-orange-300" : "text-emerald-400";
  const brandGrad = "bg-gradient-to-r from-indigo-500 to-violet-500";
  const brandGradSoft = "bg-gradient-to-r from-indigo-400 to-violet-400";

  return (
    <motion.article
      layout
      role="article"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-950 to-slate-900 shadow-md"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.6 }}
    >
      {/* sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 blur-[2px] transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(120deg,transparent,rgba(99,102,241,0.25),rgba(139,92,246,0.25),transparent)",
        }}
      />

      <div className="relative h-44 overflow-hidden">
        <motion.img
          src={event.image}
          alt=""
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.45 }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />

        {/* category */}
        <div className="absolute left-3 top-3">
          <motion.span
            className={`rounded-md ${brandGrad} px-2 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
          >
            {event.category}
          </motion.span>
        </div>

        {/* date pill */}
        <motion.div
          className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-center shadow-sm backdrop-blur"
          whileHover={{ scale: 1.05 }}
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

        {/* capacity */}
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Spots</span>
            <span className={`text-xs font-semibold ${statusTone}`}>{spotsLeft > 0 ? `${spotsLeft} left` : "Full"}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/50">
            <motion.div
              className={`h-1.5 rounded-full ${spotsLeft === 0 ? "bg-slate-600" : brandGradSoft}`}
              initial={{ width: 0 }}
              animate={{ width: `${fillPercentage}%` }}
              transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* CTA */}
        <motion.button
          onClick={() => onRegister?.(event)}
          className={`relative mt-auto w-full overflow-hidden rounded-xl py-2 px-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            spotsLeft === 0
              ? "cursor-not-allowed bg-slate-700/60 text-slate-500"
              : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-500"
          }`}
          disabled={spotsLeft === 0}
          whileHover={spotsLeft > 0 ? { scale: 1.02 } : {}}
          whileTap={spotsLeft > 0 ? { scale: 0.98 } : {}}
        >
          {spotsLeft === 0 ? "Event Full" : "Quick Register"}
        </motion.button>
      </div>
    </motion.article>
  );
};

/* =========================================
   Page: All Events
========================================= */
const Events = () => {
  const PAGE_SIZE = 12;
  const prefersReducedMotion = useReducedMotion();

  // ---------- UI State ----------
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("upcoming");
  const [page, setPage] = useState(1);

  // Data state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadMoreRef = useRef(null);

  // ---------- Demo seed (remove once wired) ----------
  const SEED = useMemo(
    () => [
      { id: 101, title: "Campus Hackathon 2025", image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&auto=format&fit=crop&q=60", category: "Hackathon", date: "May 10, 2025", time: "9:00 AM", month: "MAY", day: "10", location: "Innovation Lab", maxCapacity: 300, registeredCount: 248, createdAt: "2025-03-15" },
      { id: 102, title: "Inter-University Programming Contest", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=60", category: "Programming", date: "Jun 2, 2025", time: "10:00 AM", month: "JUN", day: "02", location: "Computer Science Building", maxCapacity: 200, registeredCount: 172, createdAt: "2025-03-20" },
      { id: 1, title: "Tech Innovation Summit 2024", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=60", category: "Technology", date: "Mar 15, 2024", time: "9:00 AM", month: "MAR", day: "15", location: "Main Auditorium", maxCapacity: 200, registeredCount: 156, createdAt: "2024-02-01" },
      { id: 2, title: "Cultural Night: Around the World", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop&q=60", category: "Cultural", date: "Mar 22, 2024", time: "6:00 PM", month: "MAR", day: "22", location: "Student Center", maxCapacity: 150, registeredCount: 89, createdAt: "2024-02-06" },
      { id: 3, title: "Startup Pitch Competition", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop&q=60", category: "Business", date: "Mar 28, 2024", time: "2:00 PM", month: "MAR", day: "28", location: "Business Hall", maxCapacity: 100, registeredCount: 97, createdAt: "2024-02-14" },
      { id: 4, title: "Green Campus Workshop", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=60", category: "Environment", date: "Apr 5, 2024", time: "10:00 AM", month: "APR", day: "05", location: "Science Building", maxCapacity: 80, registeredCount: 45, createdAt: "2024-02-20" },
      { id: 5, title: "Annual Sports Tournament", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=60", category: "Sports", date: "Apr 12, 2024", time: "8:00 AM", month: "APR", day: "12", location: "Sports Complex", maxCapacity: 300, registeredCount: 234, createdAt: "2024-02-24" },
      { id: 6, title: "Art & Design Exhibition", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&auto=format&fit=crop&q=60", category: "Arts", date: "Apr 18, 2024", time: "3:00 PM", month: "APR", day: "18", location: "Art Gallery", maxCapacity: 120, registeredCount: 67, createdAt: "2024-03-01" },
    ],
    []
  );

  // ---------- Load Events ----------
  useEffect(() => {
    setLoading(true);

    // Demo: mock a longer list by duplicating SEED
    const simulated = [
      ...SEED,
      ...SEED.map((e, i) => ({ ...e, id: e.id * 100 + i, title: `${e.title} (Session ${i + 1})` })),
      ...SEED.map((e, i) => ({ ...e, id: e.id * 200 + i, title: `${e.title} – Workshop ${i + 1}`, category: i % 2 ? e.category : "Workshop" })),
    ];
    const t = setTimeout(() => {
      setEvents(simulated);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  // ---------- Derived ----------
  const categories = useMemo(() => {
    const set = new Set(["All"]);
    events.forEach((e) => set.add(e.category));
    return Array.from(set);
  }, [events]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = events.filter((e) => {
      const matchesQ = !q || e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.category.toLowerCase().includes(q);
      const matchesCat = activeCategory === "All" || e.category === activeCategory;
      return matchesQ && matchesCat;
    });

    switch (sortBy) {
      case "popular": list = list.sort((a, b) => b.registeredCount - a.registeredCount); break;
      case "newest": list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case "capacity": list = list.sort((a, b) => b.maxCapacity - a.maxCapacity); break;
      default: list = list.sort((a, b) => (a.date || "").localeCompare(b.date || "")); // upcoming
    }
    return list;
  }, [events, query, activeCategory, sortBy]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  // ---------- Handlers ----------
  const onRegister = (event) => {
    console.log("Register clicked:", event.title);
    alert(`Pretend registered for: ${event.title}`);
  };

  const loadMore = () => {
    if (!hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoadingMore(false);
    }, 300);
  };

  // Infinite scroll via IntersectionObserver
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
  }, [hasMore, prefersReducedMotion]);

  // ---------- Anim Variants ----------
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };
  const item = { hidden: { opacity: 0, y: 12, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 18 } } };

  // ---------- UI ----------
  return (
    <section className="relative min-h-screen bg-[#0b1220] py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="inline-flex bg-gradient-to-r from-indigo-300 via-white to-violet-300 bg-clip-text text-3xl font-black text-transparent md:text-4xl">All Events</h1>
          <p className="mt-2 text-slate-400">Search, filter and discover everything happening.</p>
        </div>

        {/* Sticky Controls */}
        <div className="sticky top-2 z-20 mb-8 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40 p-3 shadow-sm">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
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
                  onClick={() => { setActiveCategory(cat); setPage(1); }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                    activeCategory === cat ? "bg-indigo-600 text-white" : "bg-slate-800/70 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
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

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-6 text-red-300">{error || "Something went wrong."}</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-10 text-center">
            <p className="text-slate-300">No events match your filters.</p>
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
              {visible.map((e) => (
                <motion.div key={e.id} variants={prefersReducedMotion ? undefined : item}>
                  {/* LINK TO DETAILS */}
                  <Link to={`/events/${e.id}`} state={{ event: e }} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:rounded-2xl">
                    <EventCard event={e} onRegister={onRegister} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Load more / sentinel */}
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
