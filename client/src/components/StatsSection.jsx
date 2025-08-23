import React, { useState, useEffect, useRef } from "react";

const CountUpAnimation = ({ start = 0, end, duration = 2.5, suffix = "" }) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Smooth easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (end - start) * easeOutQuart;
      
      setCount(Math.floor(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, start, end, duration]);

  return (
    <span ref={ref} className="font-black">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const StatCard = ({ value, suffix, label, Icon, delay = 0 }) => (
  <div 
    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-slate-700/30 p-6 shadow-2xl backdrop-blur-md transition-all duration-700 hover:scale-[1.02] hover:shadow-3xl hover:border-sky-400/20"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/3 to-purple-500/3 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
    
    {/* Animated border glow */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/10 to-purple-500/10 rounded-2xl opacity-0 blur transition-all duration-700 group-hover:opacity-100" />
    
    <div className="relative flex items-center justify-between">
      <div className="flex-1">
        <div className="text-4xl font-black leading-none text-white mb-2 transition-colors duration-500 group-hover:text-sky-200">
          <CountUpAnimation start={0} end={value} suffix={suffix} />
        </div>
        <div className="text-sm font-semibold text-slate-400 transition-colors duration-500 group-hover:text-slate-300">
          {label}
        </div>
      </div>
      <div className="ml-4 text-sky-400 transition-all duration-500 group-hover:text-sky-300 group-hover:scale-105">
        <Icon className="h-7 w-7" />
      </div>
    </div>
    
    {/* Bottom accent line */}
    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-sky-400/50 to-purple-400/50 transition-all duration-1000 group-hover:w-full" />
  </div>
);

// Enhanced icons with better visual weight
const ClubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V5.5C15 4.67 14.33 4 13.5 4H10.5C9.67 4 9 4.67 9 5.5V7.5L3 7V9L9 8.5V15H11V22H13V15H15V8.5L21 9Z"/>
  </svg>
);

const PartnersIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4M16 14C20.4 14 24 15.8 24 18V20H8V18C8 15.8 11.6 14 16 14M8.5 4C10.7 4 12.5 5.8 12.5 8S10.7 12 8.5 12 4.5 10.2 4.5 8 6.3 4 8.5 4M8.5 14C12.9 14 16.5 15.8 16.5 18V20H0V18C0 15.8 4.1 14 8.5 14Z"/>
  </svg>
);

const MembersIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
  </svg>
);

const ProjectsIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

const StatsSection = () => {
  // TODO: Replace with actual data fetching logic
  // const { stats, loading, error } = useStatsData();
  // const { activeClubs } = useClubsData();
  // const { partnersCount } = usePartnersData();
  // const { membersCount } = useMembersData();
  // const { projectsCount } = useProjectsData();
  
  const stats = [
    { value: 10, suffix: "+", label: "Vibrant Clubs", Icon: ClubIcon },
    { value: 50, suffix: "+", label: "Club Partners", Icon: PartnersIcon },
    { value: 9000, suffix: "+", label: "Happy Members", Icon: MembersIcon },
    { value: 350, suffix: "+", label: "Projects Done", Icon: ProjectsIcon },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0b1220] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)`
        }} />
      </div>

      {/* Subtle animated background particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-sky-400/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400/80 to-pink-400/80 tracking-wider uppercase mb-4">
            Who we are
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white/95 leading-tight">
            Your Gateway to Campus{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
              Community
            </span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              delay={index * 150}
            />
          ))}
        </div>

        {/* Bottom decorative element */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-700/30 text-slate-400 text-sm backdrop-blur-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live statistics updated in real-time
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </section>
  );
};

export default StatsSection;