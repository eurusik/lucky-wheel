import React, { useState, useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, Snackbar, Alert } from '@mui/material';
import { useToast } from '../ui/ToastProvider';
import CloseIcon from '@mui/icons-material/Close';
import ItemList from '../settings/ItemList';
import ActionButtons from '../settings/ActionButtons';
import { WheelItem } from '../../types';
import { generateRandomColor, MAX_ITEMS } from '../../constants/wheelConfig';
import { SETTINGS } from '../../constants/styleConfig';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  items: WheelItem[];
  onSave: (items: WheelItem[]) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose, items, onSave }) => {
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(items);
  const [showLimitError, setShowLimitError] = useState(false);
  const { showToast } = useToast();

  // Update local state if items change externally
  useEffect(() => {
    setWheelItems(items);
  }, [items]);

  const handleAddItem = () => {
    if (wheelItems.length >= MAX_ITEMS) {
      setShowLimitError(true);
      return;
    }

    const newItem: WheelItem = {
      id: Date.now().toString(),
      name: '',
      color: generateRandomColor(),
    };
    const newItems = [...wheelItems, newItem];
    setWheelItems(newItems);
  };

  const handleRemoveItem = (id: string) => {
    const newItems = wheelItems.filter(item => item.id !== id);
    setWheelItems(newItems);
  };

  const handleNameChange = (id: string, newName: string) => {
    const newItems = wheelItems.map(item =>
      item.id === id ? { ...item, name: newName } : item
    );
    setWheelItems(newItems);
  };

  const handleSave = () => {
    onSave(wheelItems);
    showToast('Changes saved!', 'success');
    onClose();
  };


  const handleCloseError = () => {
    setShowLimitError(false);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100%',
          height: '100%',
          bgcolor: 'background.paper',
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: SETTINGS.SPACING.CONTENT_PADDING,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              margin: '12px'
            }}
          >
            Settings
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: SETTINGS.SPACING.CONTENT_PADDING,
          }}
        >
          {/* Wheel Sectors Section */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, ml: 2 }}>
              Wheel Sectors
            </Typography>
            <Alert severity="info" sx={{ ml: 2, mb: 1, py: 0.5, px: 2, fontSize: '0.82em', alignItems: 'center' }} icon={false}>
              {`Maximum ${MAX_ITEMS} sectors allowed.`}
            </Alert>
            <ItemList
              items={wheelItems}
              onRemove={handleRemoveItem}
              onNameChange={handleNameChange}
            />
          </Box>
        </Box>

        <ActionButtons
          items={wheelItems}
          onAddItem={handleAddItem}
          onSave={handleSave}
        />
      </Box>

      <Snackbar 
        open={showLimitError} 
        autoHideDuration={3000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="warning" 
          sx={{ 
            width: '100%',
            backgroundColor: '#fff3e0',
            color: '#e65100',
            '& .MuiAlert-icon': {
              color: '#f57c00'
            }
          }}
        >
          {`Cannot add more than ${MAX_ITEMS} participants`}
        </Alert>
      </Snackbar>
    </Drawer>
  );
};

export default SettingsDialog;
