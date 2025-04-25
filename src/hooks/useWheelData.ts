import { useState, useEffect, useCallback } from 'react';
import { WheelItem } from '../types';

interface UseWheelDataProps {
  id?: string;
  initialItems: WheelItem[];
  initialName: string;
  onWheelSettingsChange: (items: WheelItem[], name: string) => void;
}

interface UseWheelDataResult {
  wheelItems: WheelItem[];
  wheelName: string;
  wheelId: string;
  isLoading: boolean;
  error: Error | null;
  updateWheelItems: (items: WheelItem[]) => void;
  updateWheelName: (name: string) => void;
  handleSettingsSave: (updatedItems: WheelItem[], updatedWheelName: string) => void;
}

/**
 * Hook for managing wheel data (items, name, loading state)
 */
export const useWheelData = ({
  id,
  initialItems,
  initialName,
  onWheelSettingsChange
}: UseWheelDataProps): UseWheelDataResult => {
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(initialItems || []);
  const [wheelName, setWheelName] = useState(initialName || '');
  const [isLoading, setIsLoading] = useState(initialItems.length === 0);
  const [error, setError] = useState<Error | null>(null);

  // Update wheelItems when initialItems prop changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      setWheelItems(initialItems || []);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      console.error('Error updating wheel items:', err);
    }
  }, [initialItems]);

  // Update wheelName when initialName prop changes
  useEffect(() => {
    setWheelName(initialName || '');
  }, [initialName]);

  // Generate wheelId from id or first item id
  const wheelId = id || wheelItems[0]?.id || '';

  // Handlers for updating wheel data
  const updateWheelItems = useCallback((items: WheelItem[]) => {
    setWheelItems(items);
  }, [setWheelItems]);

  const updateWheelName = useCallback((name: string) => {
    setWheelName(name);
  }, [setWheelName]);

  // Handler for saving settings
  const handleSettingsSave = useCallback((updatedItems: WheelItem[], updatedWheelName: string) => {
    try {
      setError(null);
      setWheelItems(updatedItems);
      setWheelName(updatedWheelName);
      onWheelSettingsChange(updatedItems, updatedWheelName); // Persist all changes
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save settings'));
      console.error('Error saving wheel settings:', err);
    }
  }, [onWheelSettingsChange, setError, setWheelItems, setWheelName]);

  return {
    wheelItems,
    wheelName,
    wheelId,
    isLoading,
    error,
    updateWheelItems,
    updateWheelName,
    handleSettingsSave
  };
};
