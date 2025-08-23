// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events.jsx";
import EventDetails from "./pages/EventDetails"; // 👈 add this
import Layout from "./Layout";
import EventCreate from "./pages/EventCreate.jsx";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} /> {/* 👈 details */}
        <Route path="/events/new" element={<EventCreate />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
