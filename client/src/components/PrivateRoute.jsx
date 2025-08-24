// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useSelector(state => state.user);
  const location = useLocation();

  // Show loading spinner while authentication is being checked
  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!currentUser) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
