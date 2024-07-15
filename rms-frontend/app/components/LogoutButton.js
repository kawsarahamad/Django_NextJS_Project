// app/components/LogoutButton.js
"use client";
import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter hook for navigation
import { useAuth } from '../AuthContext';
import styles from './LogoutButton.module.css';

const LogoutButton = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      console.log('Log out button clicked');
      // Make a POST request to logout API
      const response = await fetch('http://127.0.0.1:8000/resultapp/accounts/logout/', {
        method: 'GET',
        credentials: 'include', // Important for sending cookies
        headers: {
            'Content-Type': 'application/json',
            // Add any additional headers required by your server
          },
      });

      if (response.ok) {
        // Successful logout from API
        logout(); // Clear local session
        router.push('../'); // Redirect to landing page or desired route
      } else {
        console.error('Logout failed:', response.statusText);
        // Handle logout failure if needed
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout error
    }
  };

  return (
    <button onClick={handleLogout} className={styles.logoutButton}>
      Logout
    </button>
  );
};

export default LogoutButton;
