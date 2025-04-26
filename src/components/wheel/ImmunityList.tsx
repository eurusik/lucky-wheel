import React from 'react';
import { Box, Chip } from '@mui/material';
import ImmunityPlaceholder from './ImmunityPlaceholder';
import { SectorImmunity } from '../../types';
import { COLORS, STACK_GAP, CHIP } from '../../constants/styleConfig';

interface ImmunityListProps {
  immunities: SectorImmunity[];
  isMediumScreen: boolean;
  onDelete: (sectorIndex: number) => void;
}

const ImmunityList: React.FC<ImmunityListProps> = ({
  immunities,
  isMediumScreen,
  onDelete,
}) => {
  return (
    <>
      {immunities.length > 0 ? (
        <Box sx={{ 
          position: 'relative',
          minHeight: 120,
          border: '2px dashed #ffe082',
          borderRadius: 3,
          background: '#fffbe9',
          px: { xs: 2, sm: 3 },
          py: 2,
          mt: 3,
          mb: 3,
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '100%', 
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: STACK_GAP.md, 
            width: '100%',
            justifyContent: 'flex-start'
          }}>
            {immunities.map((immunity) => (
              <Chip
                key={immunity.sectorIndex}
                label={immunity.name}
                onDelete={() => onDelete(immunity.sectorIndex)}
                sx={{
                  borderRadius: CHIP.borderRadius,
                  fontWeight: CHIP.fontWeight,
                  fontSize: CHIP.fontSize.md,
                  height: CHIP.height.md,
                  padding: CHIP.padding,
                  backgroundColor: COLORS.STAR_BACKGROUND,
                  mr: STACK_GAP.md,
                  mb: STACK_GAP.md,
                  maxWidth: { xs: 'auto', sm: 'auto' },
                  '&:hover': {
                    ...CHIP['&:hover'],
                    backgroundColor: COLORS.STAR_BACKGROUND_HOVER,
                  },
                  '& .MuiChip-label': {
                    fontWeight: CHIP['& .MuiChip-label']?.fontWeight || CHIP.fontWeight,
                    maxWidth: { xs: '180px', sm: '200px', md: '250px' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                  },
                  '& .MuiChip-deleteIcon': {
                    fontSize: isMediumScreen ? '1.02rem' : '1.1rem',
                    color: '#bfa100',
                    right: 4,
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      ) : (
        <Box sx={{ 
          width: '100%', 
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <ImmunityPlaceholder />
        </Box>
      )}
    </>
  );
};

export default ImmunityList;
