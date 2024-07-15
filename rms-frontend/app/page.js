
// // pages/index.js
// import Link from 'next/link';
// import Head from 'next/head';
// import styles from './Home.module.css';

// export default function Home() {
//     return (
//         <div className={styles.container}>
//             <nav className={styles.nav}>
//                 <title>Result Management System</title>
//             </nav>
//             <main className={styles.main}>
//                 <h1 className={styles.title}>Welcome to the Result Management System</h1>
//                 <p className={styles.description}>
//                     Please <Link href="/login" className={styles.link}>login</Link> to continue.
//                 </p>
//             </main>
//         </div>
//     );
// }

// pages/index.js
"use client";
import Link from 'next/link';
import Head from 'next/head';
import styles from './Home.module.css';
import LoginForm from './components/LoginForm';


export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Result Management System</title>
            </Head>
            <LoginForm />
        </div>
    );
}
