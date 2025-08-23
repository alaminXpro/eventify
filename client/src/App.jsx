// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import EventCreate from "./pages/EventCreate";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile"; 

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Events */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/create" element={<EventCreate />} /> {/* 👈 Event creation */}
        <Route path="/events/:id" element={<EventDetails />} />

        {/* Student */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Registered events list */}
        <Route path="/profile" element={<Profile />} /> {/* Student profile */}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
