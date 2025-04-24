import React from 'react';
import WheelCreatedModal from '../components/ui/WheelCreatedModal';
import HomeLogo from '../components/ui/HomeLogo';
import WheelBrowserButton from '../components/ui/WheelBrowserButton';
import CreateWheelButton from '../components/ui/CreateWheelButton';
import GitHubButton from '../components/ui/GitHubButton';
import SearchBar from '../components/ui/SearchBar';
import { Box } from '@mui/material';
import { useWheelCreation } from '../hooks/useWheelCreation';

// Inline styles matching Lucky Wheel app's design
const titleStyle: React.CSSProperties = {
  fontSize: 38,
  fontWeight: 700,
  color: '#212121',
  marginBottom: 12,
  textAlign: 'center',
  letterSpacing: 0.5,
};
const subtitleStyle: React.CSSProperties = {
  fontSize: 20,
  color: '#757575',
  marginBottom: 24,
  textAlign: 'center',
};
const getInputStyle = (hasError: boolean): React.CSSProperties => ({
  minWidth: 260,
  fontSize: 20,
  padding: '12px 20px',
  borderRadius: 12,
  border: `1.5px solid ${hasError ? '#f44336' : '#bbb'}`,
  outline: 'none',
  marginBottom: 0,
  background: hasError ? 'rgba(244, 67, 54, 0.03)' : '#fff',
  color: '#222',
  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
});

const errorMessageStyle: React.CSSProperties = {
  color: '#f44336',
  fontSize: '0.85rem',
  marginTop: '6px',
  textAlign: 'center',
  maxWidth: '320px',
  fontWeight: 500,
};

const HomePage: React.FC = () => {
  const {
    wheelName,
    setWheelName,
    isSubmitting,
    showModal,
    pendingId,
    errors,
    handleCreate,
    handleModalClose,
    validateField
  } = useWheelCreation();

  return (
    <>
      {/* Navigation buttons container - aligns buttons at the top of the page */}
      <Box sx={{ 
        position: 'fixed',
        top: 16,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        zIndex: 100,
        height: '60px',
      }}>
        {/* GitHub Button - Left side */}
        <GitHubButton repoOwner="eurusik" repoName="lucky-wheel" />
        
        {/* Search Bar - Center */}
        <Box sx={{ 
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'auto',
          maxWidth: '300px',
        }}>
          <SearchBar />
        </Box>
        
        {/* Browse Wheels Button - Right side */}
        <WheelBrowserButton />
      </Box>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        boxSizing: 'border-box',
        width: '100%',
        overflowY: 'auto',
        paddingTop: '60px', // Додаємо відступ зверху, щоб уникнути накладання
      }}>
        <div style={{
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '0 16px',
          marginTop: '20px'
        }}>
          <HomeLogo />
          <h1 style={titleStyle}>Create Your Wheel</h1>
          <p style={subtitleStyle}>Enter a name for your wheel and start playing!</p>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: errors.wheelName ? 8 : 24, alignItems: 'center', marginTop: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="text"
                value={wheelName}
                onChange={e => setWheelName(e.target.value)}
                onBlur={() => validateField('wheelName')}
                placeholder="Wheel name"
                style={getInputStyle(!!errors.wheelName)}
                aria-label="Wheel name"
                aria-invalid={!!errors.wheelName}
                required
                disabled={isSubmitting}
              />
              {errors.wheelName && (
                <div style={errorMessageStyle} role="alert">
                  {errors.wheelName}
                </div>
              )}
            </div>
            <CreateWheelButton 
              type="submit" 
              disabled={isSubmitting || !!errors.wheelName} 
            />
          </form>
          <WheelCreatedModal
            open={showModal}
            onClose={handleModalClose}
            wheelName={wheelName.trim()}
            wheelId={pendingId || ''}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;