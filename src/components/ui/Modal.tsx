import React from 'react';
import { cn } from '../../utils';

const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    showOverlay?: boolean;
}> = ({
    isOpen,
    onClose,
    children,
    className = '',
    showOverlay = true,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
        >
            {showOverlay && (
                <div
                    className="fixed inset-0 bg-gray-500/25"
                    onClick={onClose}
                />
            )}
            <div
                className={cn(
                    'relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg transition-all',
                    className
                )}
            >
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
