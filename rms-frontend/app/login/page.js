// pages/login.js
"use client";
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [username, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Login button is clicked")
        try {
            const response = await axios.post('http://127.0.0.1:8000/resultapp/accounts/login/', {
                username,
                password
            }, { withCredentials: true });
            console.log(response.data)
            if (response.status === 200) {
                router.push('../dashboard');
            }
        } catch (error) {
            console.log(error.response.data)
            console.error('Login failed', error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center' }}>Login</h1>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ marginBottom: '5px', display: 'block' }}>Email or Student ID</label>
                    <input type="username" value={username} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', color: 'white', backgroundColor: '#333' }} />
                </div>
                <div>
                    <label style={{ marginBottom: '5px', display: 'block' }}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', color: 'white', backgroundColor: '#333' }} />
                </div>
                <button type="submit" style={{ padding: '10px', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
            </form>
        </div>
    );
}
