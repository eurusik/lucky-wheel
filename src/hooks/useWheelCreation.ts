import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveWheel, wheelNameExists } from '../utils/wheelDataProvider';
import { defaultTeamMembers } from '../constants/wheelConfig';
import { useToast } from '../components/ui/ToastTypes';
import { useNavigate } from 'react-router-dom';

interface ValidationErrors {
  wheelName?: string;
}

interface UseWheelCreationResult {
  wheelName: string;
  setWheelName: (name: string) => void;
  isSubmitting: boolean;
  showModal: boolean;
  pendingId: string | null;
  errors: ValidationErrors;
  handleCreate: (e: React.FormEvent) => Promise<void>;
  handleModalClose: () => void;
  validateField: (field: keyof ValidationErrors) => boolean;
  isFormValid: boolean;
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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  /**
   * Handles the wheel creation process
   * Validates the name, checks for duplicates, and creates the wheel
   */
  // Validate a specific field and return if it's valid
  const validateField = (field: keyof ValidationErrors): boolean => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (field === 'wheelName') {
      // Mark the field as touched
      setTouched(prev => ({ ...prev, wheelName: true }));
      
      if (!wheelName.trim()) {
        newErrors.wheelName = 'Wheel name is required';
        isValid = false;
      } else if (wheelName.trim().length < 3) {
        newErrors.wheelName = 'Wheel name must be at least 3 characters';
        isValid = false;
      } else if (wheelName.trim().length > 50) {
        newErrors.wheelName = 'Wheel name must be less than 50 characters';
        isValid = false;
      } else {
        delete newErrors.wheelName;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Computed property to check if the entire form is valid
  const isFormValid = !Object.keys(errors).length;
  
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show all validation errors
    setTouched({ wheelName: true });
    
    // Validate all fields
    const isWheelNameValid = validateField('wheelName');
    
    if (!isWheelNameValid || isSubmitting) return;
    setIsSubmitting(true);
    
    const trimmedName = wheelName.trim();
    
    try {
      
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

  // Handle wheel name change with validation
  const handleWheelNameChange = (value: string) => {
    setWheelName(value);
    
    // If the field has been touched, validate on change
    if (touched.wheelName) {
      validateField('wheelName');
    }
  };
  
  return {
    wheelName,
    setWheelName: handleWheelNameChange,
    isSubmitting,
    showModal,
    pendingId,
    errors,
    handleCreate,
    handleModalClose,
    validateField,
    isFormValid
  };
}
