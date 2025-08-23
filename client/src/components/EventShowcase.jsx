import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

/* ---------- Event Card ---------- */
const EventCard = ({ event, onRegister }) => {
  const spotsLeft = event.maxCapacity - event.registeredCount;
  const fillPercentage = Math.min(100, Math.max(0, (event.registeredCount / event.maxCapacity) * 100));

  const statusTone =
    spotsLeft === 0 ? "text-red-400" : spotsLeft <= 10 ? "text-orange-300" : "text-emerald-400";

  const brandGrad = "bg-gradient-to-r from-indigo-500 to-violet-500";
  const brandGradSoft = "bg-gradient-to-r from-indigo-400 to-violet-400";

  return (
    <motion.div
      role="article"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-950 to-slate-900 shadow-md"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
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
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.4 }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />

        {/* category */}
        <div className="absolute left-3 top-3">
          <motion.span
            className={`rounded-md ${brandGrad} px-2 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {event.category}
          </motion.span>
        </div>

        {/* date pill */}
        <motion.div
          className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-center shadow-sm backdrop-blur"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
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
            <span className="truncate">
              {event.date} • {event.time}
            </span>
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
            <span className={`text-xs font-semibold ${statusTone}`}>
              {spotsLeft > 0 ? `${spotsLeft} left` : "Full"}
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

        {/* CTA */}
        <motion.button
          onClick={() => onRegister?.(event)}
          className={`relative mt-auto w-full overflow-hidden rounded-xl py-2 px-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            spotsLeft === 0
              ? "cursor-not-allowed bg-slate-700/60 text-slate-500"
              : `${brandGrad} text-white hover:from-indigo-400 hover:to-violet-500`
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

/* ---------- Showcase Section ---------- */
const EventsShowcase = () => {
  // sample demo data
  const featuredEvents = [
    {
      id: 101,
      title: "Campus Hackathon 2025",
      image:
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&auto=format&fit=crop&q=60",
      category: "Hackathon",
      date: "May 10, 2025",
      time: "9:00 AM",
      month: "MAY",
      day: "10",
      location: "Innovation Lab",
      maxCapacity: 300,
      registeredCount: 248,
    },
    {
      id: 102,
      title: "Inter-University Programming Contest",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=60",
      category: "Programming",
      date: "Jun 2, 2025",
      time: "10:00 AM",
      month: "JUN",
      day: "02",
      location: "Computer Science Building",
      maxCapacity: 200,
      registeredCount: 172,
    },
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=60",
      category: "Technology",
      date: "Mar 15, 2024",
      time: "9:00 AM",
      month: "MAR",
      day: "15",
      location: "Main Auditorium",
      maxCapacity: 200,
      registeredCount: 156,
    },
    {
      id: 2,
      title: "Cultural Night: Around the World",
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop&q=60",
      category: "Cultural",
      date: "Mar 22, 2024",
      time: "6:00 PM",
      month: "MAR",
      day: "22",
      location: "Student Center",
      maxCapacity: 150,
      registeredCount: 89,
    },
  ];

  const handleRegister = (event) => console.log("Register clicked for:", event.title);

  return (
    <section className="relative overflow-hidden bg-[#0b1220] py-16">
      {/* bg glows */}
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
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="mb-2 bg-gradient-to-r from-indigo-300/90 to-violet-300/90 bg-clip-text text-sm font-semibold uppercase tracking-wider text-transparent">
            Featured Events
          </p>
          <h2 className="text-4xl font-black text-white md:text-5xl">
            Upcoming{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Events
            </span>
          </h2>
        </motion.div>

        {/* marquee */}
        <div
          className="marquee group relative w-full overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%)",
          }}
        >
          <div className="track flex gap-6 will-change-transform">
            {featuredEvents.concat(featuredEvents).map((e, i) => (
              <div key={`${e.id}-${i}`} className="w-[320px] flex-shrink-0">
                {/* 👇 now clickable */}
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
