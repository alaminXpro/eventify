import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function Layout({ children }) {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideLayout && <Navbar />}
      {/* fixed navbar height = 64px (h-16) */}
      <main className=" bg-[#0b1220] text-slate-100">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}

export default Layout;
