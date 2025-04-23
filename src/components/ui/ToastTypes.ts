import React, { useContext } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastContent = string | React.ReactNode;

export interface ToastContextType {
  showToast: (message: ToastContent, type?: ToastType, confetti?: boolean) => void;
}

import { ToastContext } from './ToastProvider';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export { ToastContext };
