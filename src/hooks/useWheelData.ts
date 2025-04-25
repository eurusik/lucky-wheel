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
  const [isLoading] = useState(false);

  // Update wheelItems when initialItems prop changes
  useEffect(() => {
    setWheelItems(initialItems || []);
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
  }, []);

  const updateWheelName = useCallback((name: string) => {
    setWheelName(name);
  }, []);

  // Handler for saving settings
  const handleSettingsSave = useCallback((updatedItems: WheelItem[], updatedWheelName: string) => {
    setWheelItems(updatedItems);
    setWheelName(updatedWheelName);
    onWheelSettingsChange(updatedItems, updatedWheelName); // Persist all changes
  }, [onWheelSettingsChange]);

  return {
    wheelItems,
    wheelName,
    wheelId,
    isLoading,
    updateWheelItems,
    updateWheelName,
    handleSettingsSave
  };
};
