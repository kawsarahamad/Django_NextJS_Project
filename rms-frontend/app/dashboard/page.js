"use client";
// pages/dashboard.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
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
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h1>Welcome, {student.first_name} {student.last_name}</h1>
            <h2>Overall CGPA: {cgpa.toFixed(2)}</h2>
            <h2>Results by Semester:</h2>
            {Object.keys(semester_gpas).map(semesterId => {
                const semester = semester_gpas[semesterId];
                return (
                    <div key={semesterId}>
                        <h3>Semester: {semester.semester_number} - GPA: {semester.gpa.toFixed(2)}</h3>
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Code</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.filter(result => result.semester_id === parseInt(semesterId)).map((result, index) => (
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
            <p><a href="/logout">Logout</a></p>
        </div>
    );
}
