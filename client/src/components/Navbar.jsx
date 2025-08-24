// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clubsOpen, setClubsOpen] = useState(false);

  const clubsBtnRef = useRef(null);
  const clubsMenuRef = useRef(null);
  const location = useLocation();

  // Close dropdowns on route change
  useEffect(() => {
    setClubsOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  // Scroll state for stronger backdrop
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ESC to close menus
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setClubsOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

    const headerClass = scrolled
        ? "bg-[#0f172a] backdrop-blur-xl border-b border-white/10 shadow-lg"
        : "bg-[#0f172a] backdrop-blur-md border-b border-white/10";

  const baseLink =
    "px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 transition";
  const activeLink = "text-white bg-white/10";

  return (
    <header className={`sticky top-0 z-50 h-16 transition-colors duration-300 ${headerClass}`}>
      <nav className="mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-sky-500 to-purple-600 grid place-items-center text-white font-bold">
            E
          </div>
          <span className="text-base sm:text-lg font-semibold tracking-tight text-white">
            EVENTIFY
          </span>
        </NavLink>

        {/* Desktop links */}
        <ul className="ml-8 hidden md:flex items-center gap-1 text-sm">
          <li>
            <NavLink to="/" end className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}>
              Home
            </NavLink>
          </li>

          {/* Clubs dropdown */}
          <li className="relative">
            <button
              ref={clubsBtnRef}
              onClick={() => setClubsOpen((v) => !v)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-white/10 ${
                clubsOpen ? "bg-white/10 text-sky-300" : "text-gray-200 hover:text-white"
              }`}
            >
              Clubs
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className={`transition-transform ${clubsOpen ? "rotate-180" : ""}`}>
                <path d="M5.5 7.5 10 12l4.5-4.5" />
              </svg>
            </button>

            {clubsOpen && (
              <div
                ref={clubsMenuRef}
                className="absolute left-0 mt-2 w-56 rounded-lg border border-white/10 bg-[#001f3f]/95 backdrop-blur-xl p-2 shadow-xl"
              >
                <NavLink to="/clubs/tech" className="block rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white">
                  Tech Club
                </NavLink>
                <NavLink to="/clubs/cultural" className="block rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white">
                  Cultural Club
                </NavLink>
                <NavLink to="/clubs/sports" className="block rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white">
                  Sports Club
                </NavLink>
                <div className="my-2 h-px bg-white/10" />
                <NavLink to="/clubs" className="block rounded-md px-3 py-2 text-sm text-sky-300 hover:bg-white/10">
                  View All Clubs →
                </NavLink>
              </div>
            )}
          </li>

          <li><NavLink to="/events" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}>Events</NavLink></li>
          <li><NavLink to="/dashboard" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}>Dashboard</NavLink></li>
          <li><NavLink to="/profile" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}>Profile</NavLink></li>
        </ul>

        {/* Right desktop actions */}
        <div className="ml-auto hidden md:flex items-center gap-2">
          <Link to="/login" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition">
            Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="ml-auto md:hidden grid h-10 w-10 place-items-center rounded-md border border-white/10 text-gray-200 hover:bg-white/10 transition"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <button onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" />

          <div className="fixed inset-x-0 top-16 z-50 md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-white/10 bg-[#001f3f]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
              <div className="grid gap-1 pt-2">
                <NavLink to="/" end className={({ isActive }) => `rounded-md px-3 py-2 ${isActive ? "bg-white/10 text-white" : "text-gray-200 hover:bg-white/10 hover:text-white"}`}>
                  Home
                </NavLink>
                <details className="rounded-md">
                  <summary className="list-none cursor-pointer rounded-md px-3 py-2 text-gray-200 hover:bg-white/10 hover:text-white flex items-center justify-between">
                    <span>Clubs</span>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.5 7.5 10 12l4.5-4.5" />
                    </svg>
                  </summary>
                  <div className="mt-1 grid">
                    <NavLink to="/clubs/tech" className="rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-white/10">Tech Club</NavLink>
                    <NavLink to="/clubs/cultural" className="rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-white/10">Cultural Club</NavLink>
                    <NavLink to="/clubs/sports" className="rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-white/10">Sports Club</NavLink>
                    <NavLink to="/clubs" className="rounded-md px-3 py-2 text-sm text-sky-300 hover:bg-white/10">View All Clubs →</NavLink>
                  </div>
                </details>
                <NavLink to="/about" className={({ isActive }) => `rounded-md px-3 py-2 ${isActive ? "bg-white/10 text-white" : "text-gray-200 hover:bg-white/10 hover:text-white"}`}>
                  About Us
                </NavLink>
                <NavLink to="/dashboard" className={({ isActive }) => `rounded-md px-3 py-2 ${isActive ? "bg-white/10 text-white" : "text-gray-200 hover:bg-white/10 hover:text-white"}`}>
                  Dashboard
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `rounded-md px-3 py-2 ${isActive ? "bg-white/10 text-white" : "text-gray-200 hover:bg-white/10 hover:text-white"}`}>
                  Profile
                </NavLink>
              </div>

              <div className="mt-3">
                <Link to="/login" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
