import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { STAR_IMMUNITY_MESSAGE } from '../../constants/wheelConfig';
import { SectorImmunity } from '../../types';
import { COLORS } from '../../constants/styleConfig';
import { immunityService } from '../../services/immunityService';


type WheelLegendProps = Record<string, never>;

/**
 * Legend component that explains the meaning of the star symbol on the wheel
 * and shows the sectors with immunity
 */
const WheelLegend: React.FC<WheelLegendProps> = () => {
  const [immunities, setImmunities] = useState<SectorImmunity[]>([]);
  
  // Load immunities on component mount
  useEffect(() => {
    setImmunities(immunityService.getImmunities());
    
    // Function to update immunities on localStorage change
    const handleStorageChange = () => {
      setImmunities(immunityService.getImmunities());
    };
    
    // Subscribe to localStorage changes
    window.addEventListener('storage', handleStorageChange);
    

    window.addEventListener('immunityChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('immunityChanged', handleStorageChange);
    };
  }, []);
  return (
    <Box sx={{ mt: 2, textAlign: 'center', width: '100%' }}>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          fontSize: '1rem',
          fontWeight: 500,
          color: '#664d00',
          mb: 3,
          backgroundColor: COLORS.STAR_BACKGROUND,
          padding: '10px 16px',
          borderRadius: '18px',
          width: 'fit-content',
          margin: '0 auto 16px auto',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          border: '1px solid rgba(191, 161, 0, 0.2)',
        }}
      >
        <span style={{ fontSize: '1.6rem' }}>🛡️</span> 
        <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.4 }}>
          {STAR_IMMUNITY_MESSAGE}
        </Typography>
      </Box>
      
      {immunities.length > 0 && (
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="h5"
            color="primary"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mt: 2,
              mb: 3.5,
              letterSpacing: 0.6,
              fontSize: '1.5rem',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '3px',
                backgroundColor: 'primary.main',
                borderRadius: '2px',
              }
            }}
          >
            Sectors with immunity:
          </Typography>
          <Stack
            direction="row"
            spacing={2.5}
            useFlexGap
            flexWrap="wrap"
            sx={{ 
              mb: 3.5, 
              justifyContent: 'center',
              maxWidth: '100%',
              mx: 'auto',
            }}
          >
            {immunities.map((immunity) => (
              <Chip
                key={immunity.sectorIndex}
                label={immunity.name}
                sx={{
                  backgroundColor: COLORS.STAR_BACKGROUND,
                  fontWeight: 600,
                  mb: 2,
                  mx: 0.8,
                  px: 2.5,
                  py: 1.2,
                  height: 'auto',
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.25s ease',
                  minWidth: '80px',
                  maxWidth: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                  textOverflow: 'clip',
                  display: 'inline-flex',
                  border: '1px solid rgba(191, 161, 0, 0.15)',
                  '&:hover': {
                    boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
                    backgroundColor: '#ffe082',
                  },
                  '& .MuiChip-label': {
                    paddingLeft: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'visible',
                    textOverflow: 'clip',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  },
                  '& .MuiChip-deleteIcon': {
                    fontSize: '1.1rem',
                    color: '#bfa100',
                    right: 4,
                  },
                }}
                onDelete={() => {
                  immunityService.removeImmunity(immunity.sectorIndex);
                  window.dispatchEvent(new Event('immunityChanged'));
                }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default WheelLegend;
