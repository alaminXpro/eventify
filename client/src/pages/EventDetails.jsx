// src/pages/EventDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import api from "../utils/axiosInstance";
 import { generateCertificate } from "../utils/certificate";


/* tiny inline icon set */
const CalendarIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c1.1 0 2 .9 2 2h14c1.1 0 2-.9 2-2V5c-1.1 0-2-.9-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
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

// ===== Helpers to adapt backend -> UI =====
const fromMongoId = (id) => (id && typeof id === "object" && id.$oid ? id.$oid : id);
const fromMongoDate = (d) => {
  if (!d) return null;
  if (d instanceof Date) return d;
  if (typeof d === "string" || typeof d === "number") return new Date(d);
  if (typeof d === "object" && d.$date) return new Date(d.$date);
  return null;
};

const adaptEvent = (doc) => {
  const id = fromMongoId(doc?._id) || doc?.id || doc?.event_id;
  const startsAt =
    fromMongoDate(doc?.event_date) ||
    fromMongoDate(doc?.startsAt) ||
    fromMongoDate(doc?.start_time);
  const regDeadline = fromMongoDate(doc?.registration_deadline);

  const dateStr = startsAt
    ? new Date(startsAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "";
  const timeStr = startsAt
    ? new Date(startsAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : "";

  return {
    id,
    title: doc?.title || doc?.name || "Untitled Event",
    description: doc?.event_description || doc?.description || "",
    image: doc?.event_image || doc?.bannerUrl || doc?.image || "",
    category: doc?.category || "General",
    type: doc?.event_type || doc?.type || "",
    date: dateStr,
    time: timeStr,
    startsAt,
    registrationDeadline: regDeadline,
    duration: doc?.event_time_duration,
    location: doc?.location || doc?.venue || "TBA",
    maxCapacity: doc?.capacity ?? 0,
    registeredCount: doc?.total_registrations ?? 0,
  };
};

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const eventFromState = state?.event ? state.event : null;

  const [event, setEvent] = useState(eventFromState ? adaptEvent(eventFromState._raw || eventFromState) : null);
  const [loading, setLoading] = useState(!event);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);

  // skeleton cross-fade
  const [showingSkeleton, setShowingSkeleton] = useState(true);
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setShowingSkeleton(false), 180);
      return () => clearTimeout(t);
    } else {
      setShowingSkeleton(true);
    }
  }, [loading]);

  // user id
  const userId = (() => {
    try {
      const root = localStorage.getItem("persist:root");
      if (!root) return null;
      const parsed = JSON.parse(root);
      const userSlice = JSON.parse(parsed.user || "{}");
      return userSlice?.currentUser?._id || userSlice?.currentUser?.id || null;
    } catch {
      return null;
    }
  })();

   // Participant name for certificate
 const participantName = (() => {
   try {
     const root = localStorage.getItem("persist:root");
     if (root) {
       const parsed = JSON.parse(root);
       const u = JSON.parse(parsed.user || "{}")?.currentUser || {};
       if (u?.name) return u.name;
     }
     const direct = localStorage.getItem("currentUser");
     if (direct) return (JSON.parse(direct)?.name) || "Participant";
   } catch {}
   return "Participant";
 })();

  // increment view (best-effort)
  useEffect(() => {
    if (!id) return;
    (async () => { try { await api.patch(`/events/${id}/view`); } catch {} })();
  }, [id]);

  // fetch event if needed
  useEffect(() => {
    if (event) return;
    let ignore = false;
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/${id}`, { signal: controller.signal });
        if (!ignore) setEvent(adaptEvent(res?.data));
      } catch (e) {
        if (!ignore && e?.name !== "CanceledError" && e?.name !== "AbortError") setError("Event not found");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; controller.abort(); };
  }, [id, event]);

  // mark registered if already
  useEffect(() => {
    if (!userId || !id) return;
    let ignore = false;
    (async () => {
      try {
        const { data } = await api.get(`/events/user/${userId}/history`, { params: { status: "registered", limit: 200 } });
        if (ignore || !data) return;
        const arr = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);
        const already = arr.some((h) => String(h?.event?._id || h?.event?.id || h?.event) === String(id));
        if (already) setRegistered(true);
      } catch {}
    })();
    return () => { ignore = true; };
  }, [userId, id]);

  // Parallax
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 80]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.08]);

  const spotsLeft = useMemo(() => {
    if (!event) return 0;
    const left = (event.maxCapacity || 0) - (event.registeredCount || 0);
    return Math.max(0, left);
  }, [event]);

  const fillPct = useMemo(() => {
    if (!event || !event.maxCapacity) return 0;
    return Math.min(100, Math.max(0, ((event.registeredCount || 0) / event.maxCapacity) * 100));
  }, [event]);

  const isPast = useMemo(() => {
    if (!event?.startsAt) return false;
    return new Date(event.startsAt).getTime() < Date.now();
  }, [event]);

  const brandGrad = "bg-gradient-to-r from-indigo-500 to-violet-500";

  const handleRegister = async () => {
    if (!event) return;
    if (!userId) { navigate("/login"); return; }
    if (registered || spotsLeft === 0 || isPast) return;

    try {
      setIsRegistering(true);
      setRegistered(true);
      setEvent((prev) => prev ? { ...prev, registeredCount: (prev.registeredCount || 0) - 1 } : prev);
      await api.post("/events/register", { userId, eventId: event.id });
    } catch (err) {
      setRegistered(false);
      setEvent((prev) => prev ? { ...prev, registeredCount: Math.max(0, (prev.registeredCount || 1) - 1) } : prev);
      alert(err?.response?.data?.message || "Registration failed.");
    } finally {
      setIsRegistering(false);
    }
  };

  // Loading skeleton (kept a bit longer to cross-fade)
  if (showingSkeleton) {
    return (
      <section className="min-h-[60vh] bg-[#0b1220]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Skeleton />
        </div>
      </section>
    );
  }

  if (error || !event) {
    return (
      <section className="min-h-[60vh] bg-[#0b1220]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-8 text-red-200">
            <p className="mb-6">{error || "Event not found"}</p>
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

  const buttonDisabled = registered || spotsLeft === 0 || isRegistering;

 const eventIsPast = event?.startsAt ? new Date(event.startsAt).getTime() < Date.now() : false;

  const canDownloadCert = eventIsPast && registered;

  return (
    <section className={`relative min-h-screen bg-[#0b1220] text-slate-100 ${isPast ? "opacity-90" : ""}`}>
      {/* HERO */}
      <div className="relative">
        <motion.div style={{ y, scale }} className={`h-[40vh] w-full overflow-hidden ${isPast ? "saturate-75" : ""}`}>
          {event.image ? (
            <img src={event.image} alt="" className="h-full w-full object-cover" loading="eager" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-900">No image</div>
          )}
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
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-200">
              {(event.date || event.time) && (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                  <CalendarIcon className="h-4 w-4 text-indigo-300" />
                  {event.date}{event.time ? ` • ${event.time}` : ""}
                </span>
              )}
              {event.location && (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                  <LocationIcon className="h-4 w-4 text-indigo-300" />
                  {event.location}
                </span>
              )}
              {event.type && (
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/80 to-violet-500/80 px-3 py-1 font-semibold">
                  {event.type}
                </span>
              )}
              {event.category && (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold">
                  {event.category}
                </span>
              )}
              {isPast && (
                <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 font-semibold text-red-200">
                  Event Ended
                </span>
              )}
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
            className={`space-y-6 ${isPast ? "opacity-80" : ""}`}
          >
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
              <h2 className="mb-3 text-xl font-bold">About this event</h2>
              {event.description ? (
                <p className="whitespace-pre-wrap text-slate-300">{event.description}</p>
              ) : (
                <p className="text-slate-300">No description provided.</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6">
              <h3 className="mb-3 text-lg font-semibold">Details</h3>
              <ul className="space-y-2 text-slate-300">
                {event.duration && <li>• Duration: {event.duration}</li>}
                {event.registrationDeadline && (
                  <li>• Registration deadline: {new Date(event.registrationDeadline).toLocaleString()}</li>
                )}
                {typeof event.maxCapacity === "number" && <li>• Capacity: {event.maxCapacity}</li>}
                <li>• Type: {event.type || "—"}</li>
              </ul>
            </div>
          </motion.div>

          {/* Sticky CTA/Info */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="md:sticky md:top-20"
          >
            <div className={`overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-lg backdrop-blur ${isPast ? "opacity-80" : ""}`}>
              {typeof event.maxCapacity === "number" && (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-slate-300">Spots</span>
                    <span className={`text-sm font-semibold ${spotsLeft === 0 ? "text-red-400" : spotsLeft <= 10 ? "text-orange-300" : "text-emerald-400"}`}>
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
                </>
              )}
              <button
                onClick={handleRegister}
                disabled={buttonDisabled}
                className={`mb-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow transition ${
                  buttonDisabled
                    ? "cursor-not-allowed bg-slate-700/60 text-slate-500"
                    : "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-500"
                }`}
              >
                {registered ? "Registered" : (spotsLeft === 0 ? "Event Full" : (isRegistering ? "Registering..." : "Register Now"))}
              </button>

            {/* Certificate button: shown if event ended & user registered */}
            <button
              onClick={async () => {
                setIsGeneratingCert(true);
                try {
                  await generateCertificate({
                    participantName,
                    eventTitle: event.title,
                    eventDate: [event.date, event.time].filter(Boolean).join(" • "),
                    location: event.location,
                    orgName: "EVENTIFY",
                    logoUrl: "/brand.png",     // put your logo into /public/brand.png
                    bgUrl: event.image,        // event banner as faint background
                  });
                } finally {
                  setIsGeneratingCert(false);
                }
              }}
              disabled={!canDownloadCert || isGeneratingCert}
              className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow transition ${
                !canDownloadCert
                  ? "cursor-not-allowed bg-slate-700/60 text-slate-500"
                  : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-600"
              }`}
              title={!canDownloadCert ? "Available after the event ends and if you were registered." : "Download your certificate"}
            >
              {isGeneratingCert ? "Preparing…" : "Download Certificate"}
            </button>


              {/* meta */}
              <div className="mt-6 space-y-2 text-sm text-slate-300">
                {(event.date || event.time) && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-indigo-300" />
                    <span>{event.date}{event.time ? ` • ${event.time}` : ""}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2">
                    <LocationIcon className="h-4 w-4 text-indigo-300" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* accents */}
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

      {/* fade shimmer styles (like Profile) */}
      <style>{`
        .fade-in { animation: fadeIn 300ms ease-out both; }
        @media (prefers-reduced-motion: reduce) { .fade-in { animation: none; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .shimmer { position: relative; overflow: hidden; }
        .shimmer::after { content: ""; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @media (prefers-reduced-motion: reduce) { .shimmer::after { animation: none; } }
      `}</style>
    </section>
  );
}

/* Skeleton for details */
function Skeleton() {
  return (
    <div className="animate-pulse shimmer">
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
