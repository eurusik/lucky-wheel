import React from 'react';
import { Box, Typography, useMediaQuery, CircularProgress } from '@mui/material';
import ImmunityList from './ImmunityList';
import ClearAllImmunityChip from './ClearAllImmunityChip';
import { useImmunities } from '../../hooks/useImmunities';

import { BREAKPOINTS } from '../../constants/styleConfig';

interface WheelLegendProps {
  wheelId: string;
}

/**
 * Displays the legend for sector immunity and renders the list of immune sectors.
 * Fetches and manages immunity data and actions via the useImmunities hook.
 */
const WheelLegend: React.FC<WheelLegendProps> = ({ wheelId }) => {
  const { immunities, isLoading, error, deleteImmunity, clearAllImmunities } = useImmunities(wheelId);
  
  const isMediumScreen = useMediaQuery(`(min-width: ${BREAKPOINTS.TABLET}px) and (max-width: 1300px)`);

  return (
    <Box sx={{ 
      mt: { xs: 4, sm: 6 }, 
      textAlign: 'center', 
      width: '100%',
      height: 'auto',
      minHeight: 'min-content',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '100%',
      px: { xs: 2, sm: 0 }, 
      boxSizing: 'border-box',
      ...(isMediumScreen && {
        transform: 'scale(0.92)',
        transformOrigin: 'top center',
        maxWidth: '420px',
        margin: '0 auto'
      })
    }}>

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 1.5, 
        width: '100%', 
      }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1rem', md: isMediumScreen ? '1.08rem' : '1.15rem' }, 
            color: '#664d00', 
            textAlign: 'left', 
          }}>
          Sectors with immunity:
        </Typography>
        {immunities.length > 0 && (
          <ClearAllImmunityChip onClear={clearAllImmunities} />
        )}
      </Box>

      {/* Conditional rendering based on hook state */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} sx={{ color: '#bfa100' }} />
        </Box>
      )}
      {error && (
        <Typography color="error" sx={{ textAlign: 'center', my: 2 }}>
          Error loading immunities: {error.message}
        </Typography>
      )}
      {!isLoading && !error && (
        <ImmunityList 
          immunities={immunities}
          isMediumScreen={isMediumScreen}
          onDelete={deleteImmunity}
        />
      )}

    </Box>
  );
};

export default WheelLegend;
