import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveWheel, wheelNameExists } from '../utils/wheelDataProvider';
import { defaultTeamMembers } from '../constants/wheelConfig';
import { useToast } from '../components/ui/ToastTypes';
import { useNavigate } from 'react-router-dom';

interface UseWheelCreationResult {
  wheelName: string;
  setWheelName: (name: string) => void;
  isSubmitting: boolean;
  showModal: boolean;
  pendingId: string | null;
  handleCreate: (e: React.FormEvent) => Promise<void>;
  handleModalClose: () => void;
}

/**
 * Custom hook to manage wheel creation logic
 * Separates business logic from UI components
 */
export function useWheelCreation(): UseWheelCreationResult {
  const [wheelName, setWheelName] = useState('');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  /**
   * Handles the wheel creation process
   * Validates the name, checks for duplicates, and creates the wheel
   */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const trimmedName = wheelName.trim();
    
    try {
      // Validate input
      if (!trimmedName) {
        showToast('Please enter a wheel name', 'warning');
        setIsSubmitting(false);
        return;
      }
      
      // Check if wheel name already exists
      const nameExists = await wheelNameExists(trimmedName);
      
      if (nameExists) {
        showToast('A wheel with this name already exists. Please choose a different name.', 'error');
        setIsSubmitting(false);
        return;
      }
      
      // If name doesn't exist, create the wheel
      const newId = uuidv4();
      await saveWheel({
        id: newId,
        name: trimmedName,
        items: defaultTeamMembers,
        spinStats: { count: 0, lastSpinTime: null }
      });
      
      setPendingId(newId);
      setShowModal(true);
    } catch (error) {
      showToast('Failed to create wheel. Please try again.', 'error');
      console.error('Error creating wheel:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles the modal close action and navigation
   */
  const handleModalClose = () => {
    if (pendingId) {
      setShowModal(false);
      navigate(`/${pendingId}`);
      setPendingId(null);
    }
  };

  return {
    wheelName,
    setWheelName,
    isSubmitting,
    showModal,
    pendingId,
    handleCreate,
    handleModalClose
  };
}
