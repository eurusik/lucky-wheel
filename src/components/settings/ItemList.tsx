import React, { useMemo } from 'react';
import { Box, TextField, IconButton, Tooltip, Chip, Paper, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShieldIcon from '@mui/icons-material/Shield';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';
import { WheelItem } from '../../types';

/**
 * Props for the ItemList component
 */
interface ItemListProps {
  items: WheelItem[];
  onRemove: (id: string) => void;
  onNameChange: (id: string, name: string) => void;
  onClearImmunity: (updatedItems: WheelItem[]) => void;
}

/**
 * Component for displaying and managing the list of items
 */
export const ItemList: React.FC<ItemListProps> = React.memo(({ items, onRemove, onNameChange, onClearImmunity }) => {
  const handleClearImmunity = () => {
    const updatedItems = items.map(item => ({
      ...item,
      isImmune: false
    }));
    onClearImmunity(updatedItems);
  };

  const hasImmuneItems = useMemo(() => {
    const result = items.some(item => item.isImmune);
    console.log('Checking immune items:', { items, hasImmune: result });
    return result;
  }, [items]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {hasImmuneItems && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '8px',
            marginBottom: '8px'
          }}
        >
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleClearImmunity}
            startIcon={<NoEncryptionIcon />}
          >
            Clear All Immunity
          </Button>
        </Box>
      )}
      <Box sx={{ 
        overflowY: 'auto',
        flex: 1,
        '& > *:not(:last-child)': {
          marginBottom: 1
        }
      }}>
        {items.map((item) => (
          <Paper
            key={item.id}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderRadius: '16px 0 0 16px',
              backgroundColor: 'transparent',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              mr: '-24px',
              pr: '24px',
              ml: 2,
              '&:hover': {
                backgroundColor: '#fff',
                '& .delete-button': {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
                '& .color-indicator': {
                  width: '100%',
                  opacity: 0.1,
                }
              },
            }}
          >
            <Box
              className="color-indicator"
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '3px',
                backgroundColor: item.color || '#1976d2',
                transition: 'all 0.3s ease',
                opacity: 0.5,
              }}
            />
            <Box 
              sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1,
                pl: 2,
              }}
            >
              <TextField
                fullWidth
                size="small"
                value={item.name}
                onChange={(e) => onNameChange(item.id, e.target.value)}
                placeholder="Enter name"
                variant="standard"
                sx={{
                  '& .MuiInput-root': {
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    '&:before': {
                      borderBottom: '1px solid rgba(0,0,0,0.1)',
                    },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottom: '1px solid rgba(0,0,0,0.3)',
                    },
                    '&.Mui-focused:after': {
                      borderBottom: '2px solid #ffd54f',
                    },
                  },
                  '& .MuiInput-input': {
                    padding: '6px 0',
                    '&::placeholder': {
                      opacity: 0.5,
                    },
                  },
                }}
              />
              {item.isImmune && (
                <Tooltip title="Immunity">
                  <Chip
                    icon={<ShieldIcon sx={{ fontSize: '0.9rem' }} />}
                    label="Immunity"
                    size="small"
                    sx={{
                      height: '24px',
                      backgroundColor: 'rgba(76, 175, 80, 0.08)',
                      color: '#1b5e20',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      '& .MuiChip-icon': {
                        color: '#1b5e20',
                        marginLeft: '4px',
                      },
                      '& .MuiChip-label': {
                        padding: '0 8px',
                      },
                    }}
                  />
                </Tooltip>
              )}
            </Box>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => onRemove(item.id)}
                className="delete-button"
                size="small"
                sx={{
                  color: '#000000',
                  opacity: 0,
                  transform: 'translateX(10px)',
                  transition: 'all 0.2s ease',
                  padding: '8px',
                  marginRight: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
            </Tooltip>
          </Paper>
        ))}
      </Box>
    </Box>
  );
});
