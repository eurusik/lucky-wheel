import { useState, useEffect, useCallback } from 'react';
import { SectorImmunity } from '../types';
import { immunityService } from '../services/immunityService';

interface UseImmunitiesResult {
  immunities: SectorImmunity[];
  isLoading: boolean;
  error: Error | null;
  deleteImmunity: (sectorIndex: number) => Promise<void>;
  clearAllImmunities: () => Promise<void>;
}

export const useImmunities = (wheelId: string): UseImmunitiesResult => {
  const [immunities, setImmunities] = useState<SectorImmunity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadImmunities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedImmunities = await immunityService.getImmunities(wheelId);
      setImmunities(loadedImmunities);
    } catch (err) {
      console.error("useImmunities: Error loading immunities:", err);
      setError(err instanceof Error ? err : new Error('Failed to load immunities'));
      setImmunities([]);
    } finally {
      setIsLoading(false);
    }
  }, [wheelId]);

  useEffect(() => {
    loadImmunities();

    const handleImmunityChange = () => {
      loadImmunities();
    };

    window.addEventListener('immunityChanged', handleImmunityChange);

    return () => {
      window.removeEventListener('immunityChanged', handleImmunityChange);
    };
  }, [wheelId, loadImmunities]);

  const deleteImmunity = useCallback(async (sectorIndex: number) => {
    setError(null); 
    try {
      await immunityService.removeImmunity(wheelId, sectorIndex);
      setImmunities((prev) => prev.filter(im => im.sectorIndex !== sectorIndex));
      window.dispatchEvent(new CustomEvent('immunityChanged', { detail: { wheelId, action: 'delete', sectorIndex } }));
    } catch (err) {
      console.error("useImmunities: Error removing immunity:", err);
      setError(err instanceof Error ? err : new Error('Failed to remove immunity'));
    }
  }, [wheelId]);

  const clearAllImmunities = useCallback(async () => {
    setError(null); 
    try {
      await immunityService.clearAllImmunities(wheelId);
      setImmunities([]);
      window.dispatchEvent(new CustomEvent('immunityChanged', { detail: { wheelId, action: 'clearAll' } }));
    } catch (err) {
      console.error("useImmunities: Error clearing all immunities:", err);
      setError(err instanceof Error ? err : new Error('Failed to clear immunities'));
    }
  }, [wheelId]);

  return {
    immunities,
    isLoading,
    error,
    deleteImmunity,
    clearAllImmunities,
  };
};
