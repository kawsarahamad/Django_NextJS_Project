// app/AuthContext.js
"use client";
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/resultapp/accounts/logout/');
      setUser(null);
      localStorage.removeItem('user');
      // Redirect user to landing page after logout
      window.location.href = '/'; // or any other landing page URL
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout error if needed
    }
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
