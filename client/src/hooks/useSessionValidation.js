// src/hooks/useSessionValidation.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/axiosInstance';
import { 
  validateSessionStart, 
  validateSessionSuccess, 
  validateSessionFailure 
} from '../redux/user/userSlice';

const useSessionValidation = (intervalMinutes = 5) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);
  const intervalRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const validateSession = async () => {
      if (!currentUser) return;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        dispatch(validateSessionFailure());
        return;
      }

      try {
        dispatch(validateSessionStart());
        
        const response = await api.post('/auth/validate-session', {
          refreshToken: refreshToken
        });

        if (response.data.isValid) {
          dispatch(validateSessionSuccess(response.data));
        } else {
          dispatch(validateSessionFailure());
        }
      } catch (error) {
        console.warn('Session validation failed:', error);
        dispatch(validateSessionFailure());
      }
    };

    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only start validation if user is logged in
    if (currentUser) {
      // Validate immediately only on initial mount when user is present
      if (isInitialMount.current) {
        validateSession();
        isInitialMount.current = false;
      }

      // Set up periodic validation with correct time calculation
      intervalRef.current = setInterval(() => {
        validateSession();
      }, intervalMinutes * 60 * 1000); // Convert minutes to milliseconds (5 min = 300,000ms)

      console.log(`Session validation set up for every ${intervalMinutes} minutes`);
    } else {
      // Reset initial mount flag when user logs out
      isInitialMount.current = true;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentUser, intervalMinutes, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {};
};

export default useSessionValidation;
