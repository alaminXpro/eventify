import React, { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clubsOpen, setClubsOpen] = useState(false);

  const mobileRef = useRef(null);
  const clubsBtnRef = useRef(null);
  const clubsMenuRef = useRef(null);

  // Scroll state for stronger backdrop
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [mobileOpen]);

  // Close menus on outside click
  useEffect(() => {
    function onDocClick(e) {
      // Clubs dropdown
      if (
        clubsMenuRef.current &&
        clubsBtnRef.current &&
        !clubsMenuRef.current.contains(e.target) &&
        !clubsBtnRef.current.contains(e.target)
      ) {
        setClubsOpen(false);
      }
      // Mobile sheet
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        // only close if click is outside the sheet when open
        // (sheet covers the screen; this guards weird portals)
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // ESC to close any open menu
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
    ? "bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/10 shadow-lg"
    : "bg-[#0f172a]/70 backdrop-blur-md border-b border-white/10";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${headerClass}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-sky-500 to-purple-600 grid place-items-center text-white font-bold">
            E
          </div>
          <span className="text-base sm:text-lg font-semibold tracking-tight text-white">
            EVENTIFY
          </span>
        </a>

        {/* Desktop links */}
        <ul className="ml-8 hidden md:flex items-center gap-1 text-sm">
          <li>
            <a
              href="/"
              className="px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 transition"
            >
              Home
            </a>
          </li>

          {/* Clubs dropdown */}
          <li className="relative">
            <button
              ref={clubsBtnRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={clubsOpen}
              aria-controls="clubs-menu"
              onClick={() => setClubsOpen((v) => !v)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-white/10 ${
                clubsOpen ? "bg-white/10 text-sky-300" : "text-gray-200 hover:text-white"
              }`}
            >
              Clubs
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`transition-transform ${clubsOpen ? "rotate-180" : ""}`}
              >
                <path d="M5.5 7.5 10 12l4.5-4.5" />
              </svg>
            </button>

            {clubsOpen && (
              <div
                ref={clubsMenuRef}
                id="clubs-menu"
                role="menu"
                aria-label="Clubs"
                className="absolute left-0 mt-2 w-56 rounded-lg border border-white/10 bg-[#0b1220]/95 backdrop-blur-xl p-2 shadow-xl"
              >
                <a
                  role="menuitem"
                  href="/clubs/tech"
                  className="block rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white"
                >
                  Tech Club
                </a>
                <a
                  role="menuitem"
                  href="/clubs/cultural"
                  className="block rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white"
                >
                  Cultural Club
                </a>
                <a
                  role="menuitem"
                  href="/clubs/sports"
                  className="block rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white"
                >
                  Sports Club
                </a>
                <div className="my-2 h-px bg-white/10" />
                <a
                  role="menuitem"
                  href="/clubs"
                  className="block rounded-md px-3 py-2 text-sm text-sky-300 hover:bg-white/10"
                >
                  View All Clubs →
                </a>
              </div>
            )}
          </li>

          <li>
            <a
              href="/about"
              className="px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 transition"
            >
              About Us
            </a>
          </li>
          <li>
            <a
              href="/dashboard"
              className="px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 transition"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/profile"
              className="px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 transition"
            >
              Profile
            </a>
          </li>
        </ul>

        {/* Right: actions (desktop) */}
        <div className="ml-auto hidden md:flex items-center gap-2">
          <a
            href="/search"
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 transition"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </a>
          <a
            href="/settings"
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 transition"
            aria-label="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </a>
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
          >
            Login
          </a>
        </div>

        {/* Mobile: hamburger */}
        <button
          className="ml-auto md:hidden grid h-10 w-10 place-items-center rounded-md border border-white/10 text-gray-200 hover:bg-white/10 transition"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
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

      {/* Mobile panel */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          ref={mobileRef}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4"
        >
          <div className="grid gap-1 pt-2">
            <a href="/" className="rounded-md px-3 py-2 text-gray-200 hover:bg-white/10 hover:text-white">
              Home
            </a>

            {/* Mobile clubs as simple group */}
            <details className="rounded-md">
              <summary className="list-none cursor-pointer rounded-md px-3 py-2 text-gray-200 hover:bg-white/10 hover:text-white flex items-center justify-between">
                <span>Clubs</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 7.5 10 12l4.5-4.5" />
                </svg>
              </summary>
              <div className="mt-1 grid">
                <a href="/clubs/tech" className="rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-white/10">
                  Tech Club
                </a>
                <a href="/clubs/cultural" className="rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-white/10">
                  Cultural Club
                </a>
                <a href="/clubs/sports" className="rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-white/10">
                  Sports Club
                </a>
                <a href="/clubs" className="rounded-md px-3 py-2 text-sm text-sky-300 hover:bg-white/10">
                  View All Clubs →
                </a>
              </div>
            </details>

            <a href="/about" className="rounded-md px-3 py-2 text-gray-200 hover:bg-white/10 hover:text-white">
              About Us
            </a>
            <a href="/dashboard" className="rounded-md px-3 py-2 text-gray-200 hover:bg-white/10 hover:text-white">
              Dashboard
            </a>
            <a href="/profile" className="rounded-md px-3 py-2 text-gray-200 hover:bg-white/10 hover:text-white">
              Profile
            </a>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <a
              href="/search"
              className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-gray-200 hover:bg-white/10 transition"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </a>
            <a
              href="/settings"
              className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-gray-200 hover:bg-white/10 transition"
              aria-label="Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </a>
            <a
              href="/login"
              className="ml-auto inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
            >
              Login
            </a>
          </div>
        </div>
      </div>

      {/* subtle divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </header>
  );
}
