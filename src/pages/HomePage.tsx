import React, { useState } from 'react';
import { defaultTeamMembers } from '../constants/wheelConfig';

import { v4 as uuidv4 } from 'uuid';
import { saveWheel } from '../utils/wheelDataProvider';
import Button from '../components/ui/Button';
import WheelCreatedModal from '../components/ui/WheelCreatedModal';
import { useNavigate } from 'react-router-dom';
import HomeLogo from '../components/ui/HomeLogo';
import WheelBrowserButton from '../components/ui/WheelBrowserButton';

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

/**
 * HomePage - Main landing page for creating a new wheel
 */
const HomePage: React.FC = () => {
  const [wheelName, setWheelName] = useState('');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const newId = uuidv4();
    // Зберігаємо нове колесо в localStorage
    saveWheel({
      id: newId,
      name: wheelName.trim(),
      items: defaultTeamMembers,
      spinStats: { count: 0, lastSpinTime: null }
    });
    setPendingId(newId);
    setShowModal(true);
  };


  const handleModalClose = () => {
    if (pendingId) {
      setShowModal(false);
      navigate(`/${pendingId}`);
      setPendingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <WheelBrowserButton />
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
          />
          <Button type="submit" style={{ fontSize: 20, padding: '12px 32px', borderRadius: 12 }}>Create Wheel</Button>
        </form>
        <WheelCreatedModal
          open={showModal}
          onClose={handleModalClose}
          wheelName={wheelName.trim()}
          wheelId={pendingId || ''}
        />
      </div>
    </div>
  );
};

export default HomePage;
