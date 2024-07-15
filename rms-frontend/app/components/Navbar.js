// app/components/Navbar.js
"use client";
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useAuth } from '../AuthContext';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  
 const { user, logout } = useAuth();
  return (
    <nav className={styles.nav}>
      <div className= {styles.navLeft}>
        <Link href="/">
        Result Management System
        </Link>
      </div>
      <div className={styles.navRight}>
        {user ? (
          <>
            <span>{user.username}</span>
            <LogoutButton />
          </>
        ) : (
          <span></span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
