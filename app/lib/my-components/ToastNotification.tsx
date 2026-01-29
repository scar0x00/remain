import { useEffect, useState } from 'react';

interface ToastNotificationProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export default function ToastNotification({
    message,
    isVisible,
    onClose,
    duration = 3000
}: ToastNotificationProps) {
    const [isExiting, setIsExiting] = useState(false);
    const [isEntering, setIsEntering] = useState(true);

    useEffect(() => {
        if (isVisible) {
            setIsEntering(true);
            const enterTimer = setTimeout(() => {
                setIsEntering(false);
            }, 10);
            return () => clearTimeout(enterTimer);
        }
    }, [isVisible]);

    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsExiting(false);
            onClose();
        }, 200);
    };

    if (!isVisible && !isExiting) return null;

    return (
            <div
            className={`
                fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                py-2 px-3 text-sm text-gray-800 rounded-md bg-gray-200
                hover:text-black
                shadow-lg
                flex items-center gap-2
                transition-all duration-300 ease-out
                ${isEntering ? 'opacity-0 translate-y-2' : ''}
                ${isExiting ? 'opacity-0 translate-y-2' : ''}
                ${!isEntering && !isExiting ? 'opacity-100 translate-y-0' : ''}
            `}
        >
            <span>{message}</span>
            {/* <button
                onClick={handleClose}
                className="hover:cursor-pointer hover:text-black p-0.5 rounded"
            >
                <X size={16} className="inline" />
            </button> */}
        </div>
    );
}
