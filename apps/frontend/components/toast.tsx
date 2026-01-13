'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Toast as ToastType } from '@/context/toast-context';

interface ToastProps extends ToastType {
  onClose: () => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-gray-900',
  info: 'bg-blue-500 text-white',
};

export function Toast({ id, message, type, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = icons[type];

  useEffect(() => {
    // Trigger exit animation before unmounting
    return () => {
      setIsExiting(true);
    };
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  return (
    <div
      className={`
        flex items-center gap-3
        px-6 py-4 rounded-lg shadow-lg
        ${styles[type]}
        ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}
        transition-all duration-300
        max-w-md w-full
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="font-medium flex-1 text-sm">{message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
