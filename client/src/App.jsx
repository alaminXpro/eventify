// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import EventCreate from "./pages/EventCreate";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import EventFAQPage from "./pages/FAQ";
// Clubs
import JoinClub from "./pages/JoinClub";
import MyClubs from "./pages/MyClubs";
import Clubs from "./pages/Clubs";

// Components
import PrivateRoute from "./components/PrivateRoute";
import AuthRedirect from "./components/AuthRedirect";

// Hooks
import useSessionValidation from "./hooks/useSessionValidation";

// If/when you add a clubs listing page, import it and wire it below
// import Clubs from "./pages/Clubs";

function App() {
  // Set up periodic session validation (every 5 minutes)
  // Only runs when user is logged in
  useSessionValidation(1);

  return (
  <>
    <Layout>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          <AuthRedirect>
            <Login />
          </AuthRedirect>
        } />
        {/* Use /signup as canonical so Layout's hide rule works */}
        <Route path="/signup" element={
          <AuthRedirect>
            <Signup />
          </AuthRedirect>
        } />
        <Route path="/register" element={<Navigate to="/signup" replace />} />

        {/* Events */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/create" element={
          <PrivateRoute>
            <EventCreate />
          </PrivateRoute>
        } />
        <Route path="/events/:id" element={<EventDetails />} />

        {/* Protected User Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/profile/edit" element={
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        } />
        <Route path="/faq" element={<EventFAQPage />} />
        {/* Student */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />

        {/* Clubs */}
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/clubs/join" element={
          <PrivateRoute>
            <JoinClub />
          </PrivateRoute>
        } />
        <Route path="/clubs/my" element={
          <PrivateRoute>
            <MyClubs />
          </PrivateRoute>
        } />
        {/* Aliases / convenience redirects */}
        <Route path="/join" element={<Navigate to="/clubs/join" replace />} />
        <Route path="/my-clubs" element={<Navigate to="/clubs/my" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
      <ToastContainer />
    </>
  );
}

export default App;
