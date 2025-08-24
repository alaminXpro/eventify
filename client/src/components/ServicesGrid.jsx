import React from 'react';

const ServiceGrids = () => {
  // Services data — refined to be more catchy
  const services = [
    {
      title: "Seamless Event Management",
      description: "Plan, organize, and run successful events with effortless scheduling and attendance tracking.",
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>`
    },
    {
      title: "Easy Club Registration",
      description: "Get your club onboarded quickly and unlock tools, resources, and visibility across campus.",
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`
    },
    {
      title: "Smart Member Management",
      description: "Keep your club organized with effortless member tracking, attendance, and role management.",
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M16 7c0-2.21-1.79-4-4-4S8 4.79 8 7s1.79 4 4 4 4-1.79 4-4zM12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/></svg>`
    },
    {
      title: "Insightful Analytics",
      description: "Track engagement and growth with reports that highlight your club’s performance.",
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>`
    },
    {
      title: "Club Communication Hub",
      description: "Send updates, announcements, and chat in real time — stay connected anytime.",
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/></svg>`
    },
    {
      title: "Quick Resource Booking",
      description: "Reserve campus spaces, facilities, and equipment in seconds for hassle-free events.",
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
    }
  ];

  return (
    <section className="relative bg-[#0b1220] text-white py-20 md:py-28 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-16 w-32 h-32 bg-gradient-to-br from-sky-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-sky-400/20 rounded-2xl rotate-12 blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-purple-400/20 rounded-full blur-lg"></div>
      </div>

      <div className="container mx-auto px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
            <p className="text-xs uppercase tracking-widest text-gray-200 font-medium">
              EVENTIFY — OUR SERVICES
            </p>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Everything Your{" "}
            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent italic">
              Club
            </span>{" "}
            Needs to Shine
          </h2>

          <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed opacity-90">
            From events to resources, Eventify equips your clubs with powerful tools to
            engage, grow, and inspire on campus.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Service Card */}
              <div className="relative h-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 transition-all duration-500 hover:bg-white/15 hover:border-white/30 group-hover:-translate-y-2">
                {/* Floating Icon */}
                <div className="absolute -top-6 right-6 w-16 h-16 rounded-2xl bg-gradient-to-r from-sky-400 to-purple-600 flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-sky-400/25 group-hover:scale-110">
                  <div dangerouslySetInnerHTML={{ __html: service.icon }} />
                </div>

                {/* Content */}
                <div className="pt-8">
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-sky-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-100 transition-colors">
                    {service.description}
                  </p>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Background glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/20 to-purple-600/20 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b1220] to-transparent"></div>
    </section>
  );
};

export default ServiceGrids;
