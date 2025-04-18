import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import ConfettiAnimation from './ConfettiAnimation';

// Define toast types
type ToastType = 'success' | 'error' | 'info' | 'warning';

// Define toast content type
type ToastContent = string | React.ReactNode;

// Define toast context type
interface ToastContextType {
  showToast: (message: ToastContent, type?: ToastType) => void;
}

// Create toast context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<ToastContent>('');
  const [type, setType] = useState<ToastType>('info');
  const [showAnimation, setShowAnimation] = useState(false);

  // Show toast function
  const showToast = useCallback((content: ToastContent, toastType: ToastType = 'info') => {
    setMessage(content);
    setType(toastType);
    setOpen(true);
    
    // Show animation for info toasts (selected sector)
    if (toastType === 'info') {
      setShowAnimation(true);
    }
  }, []);

  // Handle close
  const handleClose = () => {
    setOpen(false);
    setShowAnimation(false);
  };

  // Render message content with HTML support
  const renderMessage = (content: ToastContent) => {
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    return content;
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box sx={{ position: 'relative' }}>
          <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
            {renderMessage(message)}
          </Alert>
          {showAnimation && <ConfettiAnimation count={100} size={6} duration={2} />}
        </Box>
      </Snackbar>
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
