import React from 'react';
import { Box, Paper } from '@mui/material';
import Input from '../ui/Input';
import { STACK_GAP } from '../../constants/styleConfig';
import Chip from '../ui/Chip';
import IconButton from '../ui/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ShieldIcon from '@mui/icons-material/Shield';
import { WheelItem } from '../../types';

/**
 * Props for the ItemList component
 */
interface ItemListProps {
  items: WheelItem[];
  onRemove: (id: string) => void;
  onNameChange: (id: string, name: string) => void;
}

/**
 * Component for displaying and managing the list of items
 */
const ItemList: React.FC<ItemListProps> = ({ items, onRemove, onNameChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: STACK_GAP,
        maxHeight: '65vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        py: 1,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '10px',
          '&:hover': {
            background: 'rgba(0,0,0,0.15)',
          },
        },
      }}
    >
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
            <Input
              fullWidth
              size="small"
              value={item.name}
              onChange={(e) => onNameChange(item.id, e.target.value)}
              placeholder="Enter name"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  fontSize: '0.97rem',
                  background: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffd54f',
                  borderWidth: 2,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffe082',
                },
              }}
            />
            {item.isImmune && (
              <Chip
                label="Immunity"
                color="#1b5e20"
                onDelete={() => {}}
                selected={true}
                sx={{
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
            )}
          </Box>
          <IconButton
            onClick={() => onRemove(item.id)}
            className="delete-button"
            size="small"
            tooltip="Delete"

          >
            <DeleteIcon sx={{ fontSize: '1.1rem' }} />
          </IconButton>
        </Paper>
      ))}
    </Box>
  );
};

export default React.memo(ItemList);
