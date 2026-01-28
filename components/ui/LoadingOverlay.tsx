
import React from 'react';

interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message = 'Processing...' }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/80 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]">
            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 transform scale-100 animate-[pulse_2s_infinite]">

                {/* Modern Spinner */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>

                    {/* Inner Pulse */}
                    <div className="absolute inset-4 bg-indigo-50 rounded-full animate-pulse"></div>
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-1">
                    <h3 className="text-lg font-bold text-slate-800 tracking-wide">{message}</h3>
                    <p className="text-xs text-slate-500 font-medium tracking-wider uppercase">Please wait</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
