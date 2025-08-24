// src/components/LoadingSpinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
