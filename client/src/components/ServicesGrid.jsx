import React from 'react';

const ServiceGrids = () => {
  // Services data matching your university club management system
  const services = [
    {
      title: "Event Management",
      description: "Create, manage, and track all your club events with comprehensive scheduling and attendance tracking.",
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>`
    },
    {
      title: "Club Registration",
      description: "Register your club and get access to all university resources, facilities, and event planning tools.",
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`
    },
    {
      title: "Member Management",
      description: "Efficiently manage your club members, track attendance, and organize teams for various activities.",
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M16 7c0-2.21-1.79-4-4-4S8 4.79 8 7s1.79 4 4 4 4-1.79 4-4zM12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/></svg>`
    },
    {
      title: "Analytics & Reports",
      description: "Get detailed insights about your events, member engagement, and comprehensive club performance metrics.",
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>`
    },
    {
      title: "Communication Hub",
      description: "Stay connected with members through announcements, messaging, and real-time notification systems.",
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/></svg>`
    },
    {
      title: "Resource Booking",
      description: "Book university facilities, equipment, and venues for your club events and various activities.",
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
    }
  ];

  return (
    <section className="relative bg-[#0b1220] text-white py-20 md:py-28 overflow-hidden">
      {/* Background decorative elements matching hero */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-16 w-32 h-32 bg-gradient-to-br from-sky-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-sky-400/20 rounded-2xl rotate-12 blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-purple-400/20 rounded-full blur-lg"></div>

        {/* Background dot pattern similar to hero */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        {/* Section Header matching hero style */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
            <p className="text-xs uppercase tracking-widest text-gray-200 font-medium">
              EVENTIFY — OUR SERVICES
            </p>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Empowering Your{" "}
            <span className="bg-gradient-to-r from-sky-400 to-sky-300 bg-clip-text text-transparent italic">
              Campus
            </span>
            {" "}Experience
          </h2>

          <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed opacity-90">
            Comprehensive tools and services designed to enhance your club management
            and create memorable university experiences for every student at AUST.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Service Card with glassmorphism */}
              <div className="relative h-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 transition-all duration-500 hover:bg-white/15 hover:border-white/30 group-hover:-translate-y-2">

                {/* Floating Icon */}
                <div className="absolute -top-6 right-6 w-16 h-16 rounded-2xl bg-gradient-to-r from-sky-400 to-purple-600 flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-sky-400/25 group-hover:scale-110">
                  <div dangerouslySetInnerHTML={{ __html: service.icon }} />
                </div>

                {/* Content */}
                <div className="pt-8">
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gray-100 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors">
                    {service.description}
                  </p>

                  {/* Action Button */}
                  <button className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200 transition-all duration-200 group-hover:gap-3">
                    Learn More
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      <path d="M9.41083 14.4109L10.5892 15.5892L16.1783 10.0001L10.5892 4.41089L9.41083 5.58922L12.9883 9.16672H5V10.8334H12.9883L9.41083 14.4109Z" />
                    </svg>
                  </button>
                </div>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Background glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/20 to-purple-600/20 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA matching hero style */}
        <div className="text-center mt-20">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              EXPLORE ALL SERVICES
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.41083 14.4109L10.5892 15.5892L16.1783 10.0001L10.5892 4.41089L9.41083 5.58922L12.9883 9.16672H5V10.8334H12.9883L9.41083 14.4109Z" />
              </svg>
            </a>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-sky-400/50 bg-sky-400/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-sky-300 hover:text-white hover:border-sky-300 hover:bg-sky-400/20 transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2" />
              </svg>
              Get Support
            </a>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b1220] to-transparent"></div>
    </section>
  );
};

export default ServiceGrids;