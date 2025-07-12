// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('sessionToken');
      if (token) {
        try {
          const response = await axios.post('http://your-backend-url/check-session.php', { token });
          setIsAuthenticated(response.data.valid);
          if (!response.data.valid) {
            localStorage.removeItem('sessionToken');
            navigate('/login');
          }
        } catch (error) {
          console.error('Session check failed', error);
          setIsAuthenticated(false);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
