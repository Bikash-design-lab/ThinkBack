/**
 * Toast Component
 * 
 * Renders the global notification toast.
 */

import React, { useEffect, useState } from 'react';
import { useToast } from '../../Context/ToastContext';
import '../../Styles/toast.css';

const Toast: React.FC = () => {
    const { message, type, isVisible, hideToast } = useToast();
    const [renderPulse, setRenderPulse] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setRenderPulse(true);
        } else {
            const timer = setTimeout(() => setRenderPulse(false), 300); // Wait for animation
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    if (!renderPulse && !isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'info': return 'ℹ️';
            default: return '🔔';
        }
    };

    return (
        <div className="toast-container">
            <div
                className={`toast ${type} ${!isVisible ? 'hiding' : ''}`}
                onClick={hideToast}
            >
                <span className="toast-icon">{getIcon()}</span>
                <span className="toast-message">{message}</span>
            </div>
        </div>
    );
};

export default Toast;
