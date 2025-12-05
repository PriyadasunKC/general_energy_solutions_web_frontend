import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { solarTheme } from '@/theme/theme';

export interface ToastAlertProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose: () => void;
}

export function ToastAlert({ type, message, onClose }: ToastAlertProps) {
    const getAlertStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-800',
                    iconColor: 'text-green-600',
                    icon: <CheckCircle className="w-6 h-6" />,
                    hoverBg: 'hover:bg-green-100',
                };
            case 'error':
                return {
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-800',
                    iconColor: 'text-red-600',
                    icon: <AlertCircle className="w-6 h-6" />,
                    hoverBg: 'hover:bg-red-100',
                };
            case 'warning':
                return {
                    bgColor: `bg-[${solarTheme.secondary[50]}]`,
                    borderColor: `border-[${solarTheme.secondary[300]}]`,
                    textColor: `text-[${solarTheme.secondary[800]}]`,
                    iconColor: `text-[${solarTheme.secondary[600]}]`,
                    icon: <AlertCircle className="w-6 h-6" />,
                    hoverBg: `hover:bg-[${solarTheme.secondary[100]}]`,
                };
            case 'info':
                return {
                    bgColor: `bg-[${solarTheme.primary[50]}]`,
                    borderColor: `border-[${solarTheme.primary[300]}]`,
                    textColor: `text-[${solarTheme.primary[800]}]`,
                    iconColor: `text-[${solarTheme.primary[600]}]`,
                    icon: <Info className="w-6 h-6" />,
                    hoverBg: `hover:bg-[${solarTheme.primary[100]}]`,
                };
        }
    };

    const styles = getAlertStyles();

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg border-2 animate-slide-in max-w-md ${styles.bgColor} ${styles.borderColor}`}
        >
            <div className={`flex-shrink-0 ${styles.iconColor}`}>
                {styles.icon}
            </div>
            <p className={`flex-1 font-semibold ${styles.textColor}`}>
                {message}
            </p>
            <button
                onClick={onClose}
                className={`flex-shrink-0 p-1 rounded-full transition-colors ${styles.hoverBg}`}
                aria-label="Close alert"
            >
                <X className={`w-4 h-4 ${styles.iconColor}`} />
            </button>
        </div>
    );
}
