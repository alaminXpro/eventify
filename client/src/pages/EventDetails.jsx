// src/pages/EventDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

/* tiny inline icon set */
const CalendarIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
  </svg>
);
const LocationIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const UsersIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.67 0-8 1.34-8 4v2h10v-2c0-1.03.39-1.98 1.03-2.77C10.1 13.98 8.84 13 8 13zm8 0c-.82 0-2.08.98-3.03 2.23.64.79 1.03 1.74 1.03 2.77v2h10v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const eventFromState = state?.event;

  const [event, setEvent] = useState(eventFromState || null);
  const [loading, setLoading] = useState(!eventFromState);
  const [error, setError] = useState("");

  // Try to fetch if user hit the URL directly (no router state)
  useEffect(() => {
    if (eventFromState) return;
    setLoading(true);

    /* ====== BACKEND HOOK ======
       fetch(`/api/events/${id}`)
         .then(r => r.ok ? r.json() : Promise.reject())
         .then(data => { setEvent(data); setLoading(false); })
         .catch(() => { setError("Event not found"); setLoading(false); });
    ============================ */

    // Demo fallback (no backend): simple "not found"
    const t = setTimeout(() => {
      setError("Event not found. Return to events list.");
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [id, eventFromState]);

  // Parallax header
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 80]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.08]);

  const spotsLeft = useMemo(() => {
    if (!event) return 0;
    return event.maxCapacity - event.registeredCount;
  }, [event]);
  const fillPct = useMemo(() => {
    if (!event) return 0;
    return Math.min(100, Math.max(0, (event.registeredCount / event.maxCapacity) * 100));
  }, [event]);

  const brandGrad = "bg-gradient-to-r from-indigo-500 to-violet-500";

  const handleRegister = () => {
    if (!event) return;
    /* ====== BACKEND HOOK ======
       fetch(`/api/events/${event.id}/register`, { method: "POST" })
    ================================= */
    alert(`Pretend registered for: ${event.title}`);
  };

  if (loading) {
    return (
      <section className="min-h-[60vh] bg-[#0b1220]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Skeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-[60vh] bg-[#0b1220]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-8 text-red-200">
            <p className="mb-6">{error}</p>
            <button
              onClick={() => navigate("/events")}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Back to Events
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-[#0b1220] text-slate-100">
      {/* HERO */}
      <div className="relative">
        <motion.div style={{ y, scale }} className="h-[46vh] w-full overflow-hidden">
          <img
            src={event.image}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/40 to-transparent" />
        {/* Title block */}
        <div className="pointer-events-none absolute bottom-4 left-0 right-0">
          <div className="mx-auto max-w-5xl px-6">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex bg-gradient-to-r from-indigo-200 via-white to-violet-200 bg-clip-text text-3xl font-black text-transparent md:text-5xl"
            >
              {event.title}
            </motion.h1>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                <CalendarIcon className="h-4 w-4 text-indigo-300" />
                {event.date} • {event.time}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                <LocationIcon className="h-4 w-4 text-indigo-300" />
                {event.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                <UsersIcon className="h-4 w-4 text-indigo-300" />
                {event.registeredCount}/{event.maxCapacity} registered
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/80 to-violet-500/80 px-3 py-1 font-semibold">
                {event.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 rounded-lg border border-slate-700/60 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800/60"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr,360px]">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
              <h2 className="mb-3 text-xl font-bold">About this event</h2>
              <p className="text-slate-300">
                Join us for <span className="font-semibold text-slate-100">{event.title}</span> at{" "}
                {event.location}. Expect hands-on sessions, expert speakers, and a high-energy crowd.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
                <h3 className="mb-3 text-lg font-semibold">What you’ll experience</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Engaging talks and live demos</li>
                  <li>• Meet & collaborate with peers</li>
                  <li>• Practical takeaways and resources</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
                <h3 className="mb-3 text-lg font-semibold">Agenda (high level)</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Check-in & welcome</li>
                  <li>• Keynotes / workshops</li>
                  <li>• Networking + closing notes</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
              <h3 className="mb-4 text-lg font-semibold">Speakers</h3>
              <div className="flex flex-wrap gap-4">
                {["Alex Kim", "Jordan Lee", "Taylor Morgan"].map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-900/50 px-3 py-2"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500" />
                    <div>
                      <div className="text-sm font-semibold">{name}</div>
                      <div className="text-xs text-slate-400">Guest Speaker</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sticky CTA/Info */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="md:sticky md:top-20"
          >
            <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-lg backdrop-blur">
              {/* capacity */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-slate-300">Spots</span>
                <span
                  className={`text-sm font-semibold ${
                    spotsLeft === 0
                      ? "text-red-400"
                      : spotsLeft <= 10
                      ? "text-orange-300"
                      : "text-emerald-400"
                  }`}
                >
                  {spotsLeft > 0 ? `${spotsLeft} left` : "Full"}
                </span>
              </div>
              <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
                <motion.div
                  className={`h-2 rounded-full ${brandGrad}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPct}%` }}
                  transition={{ duration: 0.9 }}
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={spotsLeft === 0}
                className={`mb-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow transition ${
                  spotsLeft === 0
                    ? "cursor-not-allowed bg-slate-700/60 text-slate-500"
                    : "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-500"
                }`}
              >
                {spotsLeft === 0 ? "Event Full" : "Register Now"}
              </button>

              {/* share */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigator.share?.({ title: event.title, url: window.location.href }) || navigator.clipboard.writeText(window.location.href)}
                  className="rounded-lg border border-slate-700/60 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/60"
                >
                  Share
                </button>
                <button
                  onClick={() => navigate("/events")}
                  className="rounded-lg border border-slate-700/60 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/60"
                >
                  See more events
                </button>
              </div>

              {/* meta */}
              <div className="mt-6 space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-indigo-300" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LocationIcon className="h-4 w-4 text-indigo-300" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* background accents */}
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
    </section>
  );
}

/* Skeleton for details */
function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-2/3 rounded bg-slate-800/60" />
      <div className="mt-4 h-5 w-1/3 rounded bg-slate-800/60" />
      <div className="mt-6 h-48 w-full rounded-xl bg-slate-800/60" />
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-36 rounded-xl bg-slate-800/60" />
        <div className="h-36 rounded-xl bg-slate-800/60" />
      </div>
    </div>
  );
}
