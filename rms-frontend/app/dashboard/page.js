// pages/dashboard.js
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '../components/dashboard.module.css'; // Adjust the import path based on your directory structure

const Dashboard = () => {
    const [data, setData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/resultapp/dashboard-data/', { withCredentials: true });
                console.log('Response Data:', response.data); 
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
                // Redirect to login if not authenticated
                if (error.response && error.response.status === 401) {
                    router.push('../login');
                }
            }
        };

        fetchData();
    }, [router]);

    if (!data || !data.student) {
        return <div>No data available</div>;
    }

    const { student, cgpa, semester_gpas, results } = data;

    return (
        <div className={styles['dashboard-container']}>
            <div className={styles['dashboard-header']}>
                <h1>Name: {student.first_name} {student.last_name}</h1>
                <h2>Student ID: {student.student_id}</h2>
                <h2>Cgpa: {cgpa.toFixed(2)}</h2>
            </div>
            <div className={styles['semester-results']}>
                <h2>Results by Semester</h2>
                {Object.keys(semester_gpas).map(semesterId => {
                    const semester = semester_gpas[semesterId];
                    return (
                        <div key={semesterId} className={styles['semester-container']}>
                            <h3>Semester: {semester.semester_number} - GPA: {semester.gpa.toFixed(2)}</h3>
                            <table className={styles['results-table']}>
                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Code</th>
                                        <th>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.filter(result => result.semester_number === parseInt(semesterId)).map((result, index) => (
                                        <tr key={index}>
                                            <td>{result.course_name}</td>
                                            <td>{result.course_code}</td>
                                            <td>{result.grade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;
