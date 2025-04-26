import { useState, useCallback } from 'react';

/**
 * Custom hook to manage the open/closed state of a dialog or modal.
 * @param initialOpen - The initial state (default is false).
 * @returns An object containing the current state (`isOpen`) and functions to open (`openDialog`) and close (`closeDialog`) the dialog.
 */
export const useDialogState = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const openDialog = useCallback(() => setIsOpen(true), []);
  const closeDialog = useCallback(() => setIsOpen(false), []);

  return { isOpen, openDialog, closeDialog };
};
