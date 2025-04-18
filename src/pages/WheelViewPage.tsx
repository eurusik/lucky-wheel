import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { wheelService } from '../services/wheelService';
import { Wheel, WheelItem, SpinStats } from '../types';
import WheelPage from './WheelPage';

export const WheelViewPage: React.FC = () => {
  const { wheelId } = useParams<{ wheelId: string }>();
  const navigate = useNavigate();
  const [wheel, setWheel] = useState<Wheel | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinStats, setSpinStats] = useState<SpinStats>({ count: 0, lastSpinTime: '' });
  const [accessHash, setAccessHash] = useState<string | null>(null);

  useEffect(() => {
    if (!wheelId) {
      navigate('/wheel-not-found');
      return;
    }

    const loadWheel = () => {
      const wheelData = wheelService.getWheel(wheelId);
      if (!wheelData) {
        navigate('/wheel-not-found');
        return;
      }

      setWheel(wheelData);
      setLoading(false);

      // Try to load access hash from localStorage
      const hash = localStorage.getItem(`wheel_access_${wheelId}`);
      if (hash) {
        setAccessHash(hash);
      }
    };

    try {
      loadWheel();
    } catch (err) {
      navigate('/wheel-not-found');
    }
  }, [wheelId, navigate]);

  const handleSpinComplete = useCallback(() => {
    setSpinStats(prev => ({
      count: prev.count + 1,
      lastSpinTime: new Date().toLocaleTimeString()
    }));
  }, []);

  const handleScreenshot = useCallback(() => {
    // Screenshot functionality can be implemented later
    console.log('Screenshot requested');
  }, []);

  const handleSettingsClick = useCallback(() => {
    if (!accessHash) {
      // Show access hash input dialog
      console.log('Need access hash to modify wheel');
      return;
    }
    // Navigate to settings or show settings dialog
    console.log('Opening settings');
  }, [accessHash]);

  const handleItemsChange = useCallback((updatedItems: WheelItem[]) => {
    if (!wheelId || !accessHash) return;

    wheelService.updateWheel(wheelId, { items: updatedItems }, accessHash);
    if (wheel) {
      setWheel({ ...wheel, items: updatedItems });
    }
  }, [wheelId, accessHash, wheel]);

  if (!wheelId) {
    navigate('/wheel-not-found');
    return null;
  }

  if (loading) {
    return (
      <Container>
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!wheel) {
    navigate('/wheel-not-found');
    return null;
  }

  return (
    <Box>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {wheel.name}
          </Typography>
        </Box>
      </Container>
      <WheelPage
        items={wheel.items}
        onSpinComplete={handleSpinComplete}
        wheelId={wheelId}
      />
    </Box>
  );
}; 