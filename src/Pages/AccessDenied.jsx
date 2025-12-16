import React from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../assets/AccessDenied.png';

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col w-full h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
                <img
                    src={image}
                    alt="Access Denied"
                    className="w-full max-w-md h-auto mx-auto mb-8 object-contain"
                />

                <h1 className="text-4xl font-bold text-gray-800 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    You do not have permission to view this page.
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="bg-bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 shadow-md"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default AccessDenied;
