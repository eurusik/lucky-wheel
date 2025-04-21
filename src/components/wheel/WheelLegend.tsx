import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Stack, useTheme, useMediaQuery } from '@mui/material';
import ImmunityPlaceholder from './ImmunityPlaceholder';
import ClearAllImmunityChip from './ClearAllImmunityChip';


import { SectorImmunity } from '../../types';
import { COLORS, BREAKPOINTS, STACK_GAP } from '../../constants/styleConfig';
import { immunityService } from '../../services/immunityService';

type WheelLegendProps = Record<string, never>;

/**
 * Legend component that explains the meaning of the star symbol on the wheel
 * and shows the sectors with immunity
 */
const WheelLegend: React.FC<WheelLegendProps> = () => {
  const [immunities, setImmunities] = useState<SectorImmunity[]>([]);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between(BREAKPOINTS.MOBILE, BREAKPOINTS.DESKTOP));
  const isMediumScreen = useMediaQuery(`(min-width: ${BREAKPOINTS.TABLET}px) and (max-width: 1300px)`);

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
    <Box sx={{ 
      mt: { xs: 4, sm: 6 }, 
      textAlign: 'center', 
      width: '100%',
      height: 'auto',
      minHeight: 'min-content',
      display: 'flex',
      flexDirection: 'column',
      ...(isMediumScreen && {
        transform: 'scale(0.92)',
        transformOrigin: 'top center',
        maxWidth: '420px',
        margin: '0 auto'
      })
    }}>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          fontSize: { 
            xs: '1rem', 
            sm: '0.9rem', 
            md: isMediumScreen ? '0.92rem' : '1rem' 
          },
          fontWeight: 500,
          color: '#664d00',
          mb: 3,
          backgroundColor: COLORS.STAR_BACKGROUND,
          padding: { 
            xs: '12px 18px', 
            sm: '10px 16px', 
            md: isMediumScreen ? '9px 13px' : '12px 18px' 
          },
          borderRadius: '18px',
          width: 'fit-content',
          margin: '0 auto 16px auto',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          border: '1px solid rgba(191, 161, 0, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <span style={{ 
            fontSize: isMediumScreen ? '1.4rem' : isTablet ? '1.3rem' : '1.6rem'
          }}>🛡️</span>
          <Typography sx={{
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1rem', md: isMediumScreen ? '1.08rem' : '1.15rem' },
            color: '#664d00',
            textAlign: 'center',
            mb: 0,
          }}>
            Sectors with immunity:
          </Typography>
        </Box>
      </Box>

      {immunities.length > 0 ? (
        <Box sx={{ 
          width: '100%',
          height: 'auto',
          minHeight: 'min-content',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1
        }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            useFlexGap
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              mb: 3.5,
              maxWidth: '100%',
              mx: 'auto',
              gap: STACK_GAP
            }}
          >
            <Box sx={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap', gap: STACK_GAP }}>
              {immunities.map((immunity) => (
                <Chip
                  key={immunity.sectorIndex}
                  label={immunity.name}
                  onDelete={() => {
                    immunityService.removeImmunity(immunity.sectorIndex);
                    window.dispatchEvent(new Event('immunityChanged'));
                  }}
                  sx={{
                    backgroundColor: COLORS.STAR_BACKGROUND,
                    fontWeight: 600,
                    mr: STACK_GAP,
                    mb: { xs: 2, sm: 0 },
                    '& .MuiChip-deleteIcon': {
                      fontSize: isMediumScreen ? '1.02rem' : '1.1rem',
                      color: '#bfa100',
                      right: 4,
                    },
                  }}
                />
              ))}
            </Box>
            <ClearAllImmunityChip
              onClear={() => {
                immunityService.clearAllImmunities();
                setImmunities([]);
                window.dispatchEvent(new Event('immunityChanged'));
              }}
            />
          </Stack>
        </Box>
      ) : (
        <ImmunityPlaceholder />
      )}
    </Box>
  );
};

export default WheelLegend;
