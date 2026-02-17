/**
 * Toast Context
 * 
 * Provides global state management for toast notifications.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    hideToast: () => void;
    message: string;
    type: ToastType;
    isVisible: boolean;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('success');
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);

    const hideToast = useCallback(() => {
        setIsVisible(false);
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
    }, [timeoutId]);

    const showToast = useCallback((msg: string, t: ToastType = 'success', duration: number = 4000) => {
        // Clear any existing timeout
        if (timeoutId) clearTimeout(timeoutId);

        setMessage(msg);
        setType(t);
        setIsVisible(true);

        const id = window.setTimeout(() => {
            setIsVisible(false);
        }, duration);

        setTimeoutId(id);
    }, [timeoutId]);

    return (
        <ToastContext.Provider value={{ showToast, hideToast, message, type, isVisible }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
