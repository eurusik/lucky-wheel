import { useState, useEffect, useCallback } from 'react';
import { WheelItem } from '../types';

// Допоміжні функції для валідації
const validateWheelItems = (items: unknown): WheelItem[] => {
  if (!Array.isArray(items)) {
    throw new Error('Invalid items: expected an array');
  }
  
  const invalidItems = items.filter(item => 
    !item || 
    typeof item !== 'object' || 
    typeof item.name !== 'string' || 
    item.name.trim() === ''
  );
  
  if (invalidItems.length > 0) {
    throw new Error(`Invalid items: ${invalidItems.length} items have invalid structure`);
  }
  
  return items;
};

const validateNoDuplicateNames = (items: WheelItem[]): void => {
  const names = items.map(item => item.name.trim());
  const uniqueNames = new Set(names);
  if (names.length !== uniqueNames.size) {
    throw new Error('Invalid items: duplicate names found');
  }
};

const validateWheelName = (name: unknown): string => {
  if (typeof name !== 'string') {
    throw new Error('Invalid name: expected a string');
  }
  
  const trimmedName = name.trim();
  if (trimmedName === '') {
    throw new Error('Invalid name: cannot be empty');
  }
  
  if (trimmedName.length > 100) {
    throw new Error('Invalid name: too long (max 100 characters)');
  }
  
  return trimmedName;
};

const addTimestampToItems = (items: WheelItem[]): WheelItem[] => {
  const now = new Date().toISOString();
  return items.map(item => ({
    ...item,
    createdAt: item.createdAt || now
  }));
};

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
    
    let timer: NodeJS.Timeout | null = null;
    
    try {
      setWheelItems(initialItems || []);
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      console.error('Error updating wheel items:', err);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [initialItems]);

  // Update wheelName when initialName prop changes
  useEffect(() => {
    setWheelName(initialName || '');
  }, [initialName]);

  // Generate wheelId from id or first item id
  const wheelId = id || wheelItems[0]?.id || '';

  // Handlers for updating wheel data
  const updateWheelItems = useCallback((items: WheelItem[]) => {
    try {
      const validItems = validateWheelItems(items);
      validateNoDuplicateNames(validItems);
      setWheelItems(validItems);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error updating wheel items:', err);
    }
  }, [setWheelItems, setError]);

  const updateWheelName = useCallback((name: string) => {
    try {
      const validName = validateWheelName(name);
      setWheelName(validName);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error updating wheel name:', err);
    }
  }, [setWheelName, setError]);

  // Handler for saving settings
  const handleSettingsSave = useCallback((updatedItems: WheelItem[], updatedWheelName: string) => {
    try {
      setError(null);
      
      const validName = validateWheelName(updatedWheelName);
      const validItems = validateWheelItems(updatedItems);
      
      if (validItems.length === 0) {
        throw new Error('Invalid items: wheel must have at least one item');
      }
      
      const itemsWithTimestamp = addTimestampToItems(validItems);
      
      setWheelItems(itemsWithTimestamp);
      setWheelName(validName);
      onWheelSettingsChange(itemsWithTimestamp, validName); // Persist all changes
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
