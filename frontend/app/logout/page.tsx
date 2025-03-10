'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MoonLoader from "react-spinners/ClipLoader";

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
        <div className="flex items-center justify-center h-screen">
            <MoonLoader
                color="#000000"
                size={70}
            />
        </div>

    );
};

export default Logout;