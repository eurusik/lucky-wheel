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
const inputStyle: React.CSSProperties = {
  minWidth: 260,
  fontSize: 20,
  padding: '12px 20px',
  borderRadius: 12,
  border: '1.5px solid #bbb',
  outline: 'none',
  marginBottom: 0,
  background: '#fff',
  color: '#222',
  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
};

const HomePage: React.FC = () => {
  const {
    wheelName,
    setWheelName,
    isSubmitting,
    showModal,
    pendingId,
    handleCreate,
    handleModalClose
  } = useWheelCreation();

  return (
    <>
      {/* Navigation buttons container - aligns buttons at the top of the page */}
      <Box sx={{ 
        position: 'absolute',
        top: 32,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 32px',
        zIndex: 100,
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
      }}>
        <div style={{
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24
        }}>
          <HomeLogo />
          <h1 style={titleStyle}>Create Your Wheel</h1>
          <p style={subtitleStyle}>Enter a name for your wheel and start playing!</p>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', marginTop: 32 }}>
            <input
              type="text"
              value={wheelName}
              onChange={e => setWheelName(e.target.value)}
              placeholder="Wheel name"
              style={inputStyle}
              aria-label="Wheel name"
              required
              disabled={isSubmitting}
            />
            <CreateWheelButton type="submit" disabled={isSubmitting} />
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