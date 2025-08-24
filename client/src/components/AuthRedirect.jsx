// src/components/AuthRedirect.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthRedirect = ({ children }) => {
  const currentUser = useSelector(state => state.user.currentUser);

  if (currentUser) {
    // If user is logged in, redirect to dashboard instead of showing login/signup pages
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthRedirect;
