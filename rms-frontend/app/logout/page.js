"use client";
import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.post('http://127.0.0.1:8000/resultapp/accounts/logout/', {}, { withCredentials: true });
                router.push('../login');
            } catch (error) {
                console.error('Logout failed', error);
            }
        };

        logout();
    }, [router]);

    return <div>Logging out...</div>;
}