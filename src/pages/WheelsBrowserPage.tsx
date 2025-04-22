import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import IconButton from '../components/ui/IconButton';
import RenameWheelModal from '../components/ui/RenameWheelModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateWheel, getWheelById } from '../utils/wheelDataProvider';
import { useNavigate } from 'react-router-dom';
import { getAllWheels } from '../utils/wheelDataProvider';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import BackToHomeButton from '../components/ui/BackToHomeButton';

import { FirestoreWheelData } from '../utils/wheelFirestore';

interface WheelSummary {
  id: string;
  name: string;
  itemsCount: number;
}

const WheelsBrowserPage: React.FC = () => {
  const [wheels, setWheels] = useState<WheelSummary[] | null>(null);
  const [loading, setLoading] = useState(true);


  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null);

  const openRenameModal = (id: string, name: string) => {
    setRenameTarget({ id, name });
    setRenameModalOpen(true);
  };
  const closeRenameModal = () => {
    setRenameModalOpen(false);
    setRenameTarget(null);
  };



  const handleDeleteWheel = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this wheel?')) return;
    try {
      const { removeWheel } = await import('../utils/wheelDataProvider');
      await removeWheel(id);
      setWheels(wheels => wheels?.filter(w => w.id !== id) || null);
    } catch {
      alert('Failed to delete wheel.');
    }
  };

  const handleRenameSave = async (newName: string) => {
    if (!renameTarget) return;
    // Get the full wheel object, update name, save
    const wheelData = await getWheelById(renameTarget.id);
    if (wheelData) {
      await updateWheel({ ...wheelData, name: newName });
      setWheels(wheels =>
        wheels?.map(w =>
          w.id === renameTarget.id ? { ...w, name: newName } : w
        ) || null
      );
    }
    closeRenameModal();
  };


  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const all = await getAllWheels(); // [{id, name, items: [...]}, ...]
      setWheels(
        all.map((w: FirestoreWheelData) => ({
          id: w.id,
          name: w.name || 'Untitled Wheel',
          itemsCount: Array.isArray(w.items) ? w.items.length : 0,
        }))
      );
      setLoading(false);
    })();
  }, []);

  if (loading || !wheels) {
    return <Loader label="Loading wheels..." container={false} />;
  }

  return (
    <Box
      sx={{
        maxWidth: { xs: '100%', sm: 520 },
        mx: 'auto',
        mt: { xs: 2, sm: 7 },
        background: '#fff',
        borderRadius: { xs: 0, sm: 6 },
        boxShadow: { xs: 'none', sm: '0 10px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.01)' },
        p: { xs: 1.5, sm: 3, md: 5 },
      }}
    >
      <BackToHomeButton />

      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: 22, sm: 28, md: 32 },
          fontWeight: 800,
          mb: { xs: 2, sm: 3 },
          color: '#222',
          letterSpacing: 0.5,
          textAlign: 'center',
          fontFamily: 'inherit',
        }}
      >
        Browse All Wheels
      </Typography>
      {wheels.length === 0 ? (
        <Typography sx={{ color: 'text.secondary', fontSize: 18, mt: 2 }}>
          No wheels found in the database.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.2, sm: 2 } }}>
          {wheels.map(wheel => (
            <Box
              key={wheel.id}
              sx={{
                background: '#fff',
                borderRadius: { xs: 2, sm: 6 },
                px: { xs: 1.5, sm: 3 },
                py: { xs: 1.2, sm: 2.5 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: { xs: '0 1px 4px rgba(0,0,0,0.04)', sm: '0 2px 12px rgba(0,0,0,0.06)' },
                border: '1.5px solid #e0e6f7',
                mb: { xs: 1, sm: 2 },
                minHeight: { xs: 54, sm: 70 },
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                  <span style={{ fontSize: 22, marginRight: 6, filter: 'drop-shadow(0 1px 4px #e91e6344)' }} role="img" aria-label="wheel">🎡</span>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: 16, sm: 22 }, color: '#222', fontFamily: 'inherit', mb: 0.5, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    {wheel.name || 'Untitled Wheel'}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: { xs: 12, sm: 15 }, color: 'text.secondary', fontFamily: 'inherit', textAlign: 'left', ml: 0, pl: 0 }}>
                  {wheel.itemsCount} items
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Button onClick={() => navigate(`/${wheel.id}`)} sx={{ fontSize: { xs: 14, sm: 16 }, px: { xs: 1.8, sm: 2.5 }, py: { xs: 0.8, sm: 1.1 }, borderRadius: 99, minWidth: 64 }}>
                  Open
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <IconButton
                    onClick={() => openRenameModal(wheel.id, wheel.name)}
                    aria-label="Rename wheel"
                    size="small"
                    tooltip="Rename"
                  >
                    <EditIcon sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteWheel(wheel.id)}
                    aria-label="Delete wheel"
                    size="small"
                    tooltip="Delete"
                  >
                    <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    {/* Modal for renaming wheel */}
    <RenameWheelModal
      open={renameModalOpen}
      initialName={renameTarget?.name || ''}
      onSave={handleRenameSave}
      onClose={closeRenameModal}
    />
  </Box>
  );
};

export default WheelsBrowserPage;
