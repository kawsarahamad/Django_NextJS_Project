"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '../components/Profile.module.css';

const Profile = () => {
    const [student, setStudent] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/resultapp/profile/', { withCredentials: true });
                setStudent(response.data.student);
            } catch (error) {
                console.error('Failed to fetch profile data', error);
                // Redirect to login if not authenticated
                if (error.response && error.response.status === 401) {
                    router.push('/login');
                }
            }
        };

        fetchProfile();
    }, [router]);

    if (!student) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Student Profile</h1>
            <div className={styles.detail}>
                <p><strong>First Name:</strong> {student.first_name}</p>
                <p><strong>Last Name:</strong> {student.last_name}</p>
                <p><strong>Student ID:</strong> {student.student_id}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Department:</strong> {student.department}</p>
            </div>
        </div>
    );
};

export default Profile;
