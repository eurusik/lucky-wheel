import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Stack, useTheme, useMediaQuery } from '@mui/material';
import { STAR_IMMUNITY_MESSAGE } from '../../constants/wheelConfig';
import { SectorImmunity } from '../../types';
import { COLORS, BREAKPOINTS } from '../../constants/styleConfig';
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
  
  // Calculate sizes based on screen size
  const getFontSize = (base: number) => {
    if (isMediumScreen && !isTablet) {
      return base * 0.85; // 15% smaller
    }
    return base;
  };
  
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
      mt: 2, 
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
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
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
            xs: '10px 16px', 
            sm: '8px 14px', 
            md: isMediumScreen ? '7px 11px' : '10px 16px' 
          },
          borderRadius: '18px',
          width: 'fit-content',
          margin: '0 auto 16px auto',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          border: '1px solid rgba(191, 161, 0, 0.2)',
        }}
      >
        <span style={{ 
          fontSize: isMediumScreen ? '1.4rem' : isTablet ? '1.3rem' : '1.6rem'
        }}>🛡️</span> 
        <Typography sx={{ 
          fontSize: { 
            xs: '0.95rem', 
            sm: '0.85rem', 
            md: isMediumScreen ? '0.92rem' : '0.95rem'
          }, 
          lineHeight: 1.4 
        }}>
          {STAR_IMMUNITY_MESSAGE}
        </Typography>
      </Box>
      
      {immunities.length > 0 && (
        <Box sx={{ 
          width: '100%',
          height: 'auto',
          minHeight: 'min-content',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1
        }}>
          <Typography
            variant="h5"
            color="primary"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mt: 2,
              mb: 3.5,
              letterSpacing: 0.6,
              fontSize: { 
                xs: '1.5rem', 
                sm: '1.3rem', 
                md: isMediumScreen ? '1.35rem' : '1.5rem'
              },
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
            spacing={1.5}
            useFlexGap
            flexWrap="wrap"
            sx={{ 
              mb: 3.5, 
              justifyContent: 'center',
              maxWidth: '100%',
              mx: 'auto',
              gap: { 
                xs: 2.5, 
                sm: 1.5, 
                md: isMediumScreen ? 0.8 : 2.5 
              }
            }}
          >
            {immunities.map((immunity) => (
              <Chip
                key={immunity.sectorIndex}
                label={immunity.name}
                onDelete={() => {
                  immunityService.removeImmunity(immunity.sectorIndex);
                  window.dispatchEvent(new Event('immunityChanged'));
                }}
                onClick={() => {
                  immunityService.removeImmunity(immunity.sectorIndex);
                  window.dispatchEvent(new Event('immunityChanged'));
                }}
                sx={{
                  backgroundColor: COLORS.STAR_BACKGROUND,
                  fontWeight: 600,
                  mb: { 
                    xs: 2, 
                    sm: 1.5, 
                    md: isMediumScreen ? 0.8 : 2 
                  },
                  mx: { 
                    xs: 0.8, 
                    sm: 0.5, 
                    md: isMediumScreen ? 0.2 : 0.8 
                  },
                  px: { 
                    xs: 2.5, 
                    sm: 2, 
                    md: isMediumScreen ? 1.75 : 2.5 
                  },
                  py: { 
                    xs: 1.2, 
                    sm: 1, 
                    md: isMediumScreen ? 0.84 : 1.2 
                  },
                  height: 'auto',
                  borderRadius: 3,
                  fontSize: { 
                    xs: '1.1rem', 
                    sm: '0.95rem', 
                    md: isMediumScreen ? '1.02rem' : '1.1rem'
                  },
                  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.25s ease',
                  minWidth: { 
                    xs: '80px', 
                    sm: '70px', 
                    md: isMediumScreen ? '75px' : '80px'
                  },
                  maxWidth: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                  textOverflow: 'clip',
                  display: 'inline-flex',
                  border: '1px solid rgba(191, 161, 0, 0.15)',
                  cursor: 'pointer',
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
                    fontSize: { 
                      xs: '1.1rem', 
                      sm: '0.95rem', 
                      md: isMediumScreen ? '1.02rem' : '1.1rem'
                    },
                    color: '#bfa100',
                    right: 4,
                  }
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
