// app/components/Navbar.js
"use client";
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useAuth } from '../AuthContext';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  
 const { user } = useAuth(); 
 
  return (
    <nav className={styles.nav}>
      <div className= {styles.navLeft}>
        {user ? (
          <Link className={styles.homeButton} href="/dashboard">
          Result Management System
          </Link>
        ) : (
          <Link className={styles.homeButton} href="/">
          Result Management System
          </Link>
        )
        }
        
      </div>
      <div className={styles.navRight}>
        {user ? (
          <>
            <Link className={styles.profile}href="../profile">
              Profile
            </Link>
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
