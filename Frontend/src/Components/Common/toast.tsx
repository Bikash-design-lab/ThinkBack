/**
 * Toast Notification Component
 * 
 * Displays temporary notification messages with auto-dismiss functionality.
 * Used for success/error/info feedback throughout the application.
 */

import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    duration = 3000,
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, 300); // Match exit animation duration
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const typeStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white',
    };

    const iconMap = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <>
            <style>
                {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideOutRight {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `}
            </style>
            <div
                className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${typeStyles[type]} flex items-center gap-3 min-w-[280px] max-w-md`}
                style={{
                    animation: isExiting
                        ? 'slideOutRight 0.3s ease-out forwards'
                        : 'slideInRight 0.3s ease-out forwards',
                }}
                role="alert"
                aria-live="polite"
            >
                <span className="text-xl font-bold">{iconMap[type]}</span>
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button
                    onClick={() => {
                        setIsExiting(true);
                        setTimeout(() => {
                            setIsVisible(false);
                            onClose?.();
                        }, 300);
                    }}
                    className="ml-2 text-white hover:opacity-80 transition-opacity"
                    aria-label="Close notification"
                >
                    ✕
                </button>
            </div>
        </>
    );
};

// Toast Container Hook for managing multiple toasts
export const useToast = () => {
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastType }>>([]);

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const ToastContainer = () => (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );

    return { showToast, ToastContainer };
};

export default Toast;
