import React, { useState, useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, Paper, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ItemList from '../settings/ItemList';
import ActionButtons from '../settings/ActionButtons';
import { WheelItem } from '../../types';
import { generateRandomColor } from '../../constants/wheelConfig';
import { SETTINGS } from '../../constants/styleConfig';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  items: WheelItem[];
  onSave: (items: WheelItem[]) => void;
}

const MAX_ITEMS = 12;

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose, items, onSave }) => {
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(items);
  const [showLimitError, setShowLimitError] = useState(false);

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
    setWheelItems([...wheelItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setWheelItems(wheelItems.filter(item => item.id !== id));
  };

  const handleNameChange = (id: string, newName: string) => {
    setWheelItems(
      wheelItems.map(item =>
        item.id === id ? { ...item, name: newName } : item
      )
    );
  };

  const handleSave = () => {
    onSave(wheelItems);
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
          <ItemList
            items={wheelItems}
            onRemove={handleRemoveItem}
            onNameChange={handleNameChange}
          />
        </Box>

        <ActionButtons
          members={wheelItems}
          onAddMember={handleAddItem}
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
          Не можна додати більше 12 учасників
        </Alert>
      </Snackbar>
    </Drawer>
  );
};

export default SettingsDialog;
