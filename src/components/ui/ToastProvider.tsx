import React, { createContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';
import ConfettiAnimation from './ConfettiAnimation';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastContent = string | React.ReactNode;

export interface ToastContextType {
  showToast: (message: ToastContent, type?: ToastType, confetti?: boolean) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<ToastContent>('');
  const [severity, setSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [showConfetti, setShowConfetti] = useState(false);

  const showToast = useCallback(
    (message: ToastContent, type: ToastType = 'info', confetti = false) => {
      setMessage(message);
      setSeverity(type);
      setOpen(true);
      setShowConfetti(confetti);
    },
    []
  );

  const handleClose = useCallback((_: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setShowConfetti(false);
  }, []);

  const value = { showToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          {message}
          {showConfetti && <ConfettiAnimation />}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};