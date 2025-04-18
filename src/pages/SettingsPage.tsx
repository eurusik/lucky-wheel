import React, { useState } from 'react';
import { Box } from '@mui/material';
import ItemList from '../components/settings/ItemList';
import ActionButtons from '../components/settings/ActionButtons';
import { WheelItem } from '../types';
import { generateRandomColor } from '../constants/wheelConfig';
import { SETTINGS } from '../constants/styleConfig';

/**
 * Props for the SettingsPage component
 */
interface SettingsPageProps {
  items: WheelItem[];
  onSave: (items: WheelItem[]) => void;
}

/**
 * Page component for managing team members
 */
const SettingsPage: React.FC<SettingsPageProps> = ({ items, onSave }) => {
  const [currentItems, setCurrentItems] = useState<WheelItem[]>(items);

  const handleAddItem = () => {
    const newItem: WheelItem = {
      id: Date.now().toString(),
      name: '',
      color: generateRandomColor(),
    };
    setCurrentItems([...currentItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setCurrentItems(currentItems.filter(item => item.id !== id));
  };

  const handleNameChange = (id: string, newName: string) => {
    setCurrentItems(
      currentItems.map(item =>
        item.id === id ? { ...item, name: newName } : item
      )
    );
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: SETTINGS.MAX_WIDTH,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: SETTINGS.SPACING.PAGE_PADDING,
          overflow: 'hidden',
        }}
      >
        <ItemList 
          items={currentItems}
          onNameChange={handleNameChange}
          onRemove={handleRemoveItem}
        />

        <ActionButtons 
          items={currentItems}
          onAddItem={handleAddItem}
          onSave={onSave}
        />
      </Box>
    </Box>
  );
};

export default SettingsPage; 