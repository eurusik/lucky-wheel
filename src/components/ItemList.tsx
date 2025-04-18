import { WheelItem } from '../types';
import { Box, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ItemListProps {
  items: WheelItem[];
  onNameChange: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}

export const ItemList = ({ items, onNameChange, onRemove }: ItemListProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((item) => (
        <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={item.name}
            onChange={(e) => onNameChange(item.id, e.target.value)}
          />
          <IconButton onClick={() => onRemove(item.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}; 