import React, { useState, useEffect } from "react";

export default function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative bg-[#0b1220] text-white min-h-screen flex items-center overflow-hidden">
      {/* Background image with parallax */}
      <div 
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80"
          alt="University campus with students collaborating"
          className={`absolute inset-0 h-[120%] w-full object-cover transition-all duration-1000 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="eager"
        />
        
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220]/95 via-[#0b1220]/80 to-[#0b1220]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220]/90 via-transparent to-transparent" />
        
        {/* Subtle animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-purple-500/10 animate-pulse" 
             style={{ animationDuration: '4s' }} />
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-8 grid md:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
            <p className="text-xs uppercase tracking-wider text-gray-200 font-medium">
              EVENTIFY — UNIVERSITY CLUB EVENTS
            </p>
          </div>

          {/* Main heading with enhanced animations */}
          <div className="space-y-4">
            <h1 className="max-w-2xl text-5xl font-black leading-tight md:text-6xl xl:text-7xl">
              <span className="block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Your{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent italic">
                    Campus
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-sky-400/50 to-cyan-300/50 blur-sm"></div>
                </span>
              </span>
              <span className="block animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                Your{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic">
                    Club
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-400/50 to-pink-400/50 blur-sm"></div>
                </span>
              </span>
              <span className="block animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                Community
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="max-w-lg text-lg text-gray-200 leading-relaxed animate-fade-in-up opacity-90" style={{ animationDelay: '0.8s' }}>
            Discover, join, and thrive in Ahsanullah University of Science and
            Technology's vibrant club ecosystem. Club admins can create, edit,
            and manage events & attendees seamlessly.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <a
              href="/clubs"
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-white to-gray-100 px-8 py-4 text-sm font-bold text-gray-900 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-white/20 transform hover:-translate-y-1"
            >
              EXPLORE CLUBS
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M9.41 14.41 10.59 15.59 16.18 10 10.59 4.41 9.41 5.59 12.99 9.17H5v1.66h7.99L9.41 14.41Z" />
              </svg>
            </a>

            <a
              href="/admin"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-sky-400/50 bg-sky-400/10 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-sky-300 hover:text-white hover:border-sky-300 hover:bg-sky-400/20 transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:rotate-12">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Manage Events
            </a>
          </div>

          {/* Stats or additional info */}
          <div className="flex items-center gap-8 pt-4 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            <div className="text-center">
              <div className="text-2xl font-bold text-sky-400">50+</div>
              <div className="text-sm text-gray-400">Active Clubs</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">1000+</div>
              <div className="text-sm text-gray-400">Students</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">200+</div>
              <div className="text-sm text-gray-400">Events</div>
            </div>
          </div>
        </div>

        {/* Right content - Floating elements */}
        <div className="hidden md:block relative">
          <div className="relative w-full h-96">
            {/* Floating cards with glassmorphism */}
            <div className="absolute top-8 right-8 w-64 h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 animate-float" style={{ animationDelay: '0s' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-purple-500 rounded-lg"></div>
                <div>
                  <div className="text-sm font-semibold">Tech Club Meeting</div>
                  <div className="text-xs text-gray-400">Tomorrow, 3:00 PM</div>
                </div>
              </div>
              <div className="text-xs text-gray-300">Discussing latest web technologies and innovations</div>
            </div>

            <div className="absolute top-24 left-4 w-56 h-28 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg"></div>
                <div>
                  <div className="text-sm font-semibold">Cultural Festival</div>
                  <div className="text-xs text-gray-400">Next Week</div>
                </div>
              </div>
              <div className="text-xs text-gray-300">Annual cultural celebration</div>
            </div>

            <div className="absolute bottom-8 right-12 w-60 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg"></div>
                <div>
                  <div className="text-sm font-semibold">Sports Tournament</div>
                  <div className="text-xs text-gray-400">Registration Open</div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 left-8 w-4 h-4 bg-sky-400/60 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-3 h-3 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-32 right-4 w-2 h-2 bg-pink-400/60 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b1220] to-transparent"></div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}