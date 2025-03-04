'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        // Clear user session or token here
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        // Redirect to login page
        router.push('/login');
    }, [router]);

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
};

export default Logout;