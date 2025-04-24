import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import IconButton from '../components/ui/IconButton';
import RenameWheelModal from '../components/ui/RenameWheelModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateWheel, getWheelById, getWheelsPage, removeWheel } from '../utils/wheelDataProvider';
import { useToast } from '../components/ui/ToastTypes';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import BackToHomeButton from '../components/ui/BackToHomeButton';
import SearchBar from '../components/ui/SearchBar';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface WheelSummary {
  id: string;
  name: string;
  itemsCount: number;
  createdAt?: number; // Timestamp of wheel creation
}

// Helper function to format date as DD.MM.YY
const formatDate = (timestamp?: number): string => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(2); // Get last 2 digits of year
  
  return `${day}.${month}.${year}`;
};

const WheelsBrowserPage: React.FC = () => {
  const { showToast } = useToast();
  const [wheels, setWheels] = useState<WheelSummary[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null);

  const navigate = useNavigate();

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
      await removeWheel(id);
      setWheels(wheels => wheels.filter(w => w.id !== id));
      showToast('Wheel deleted!', 'error');
    } catch {
      alert('Failed to delete wheel.');
    }
  };

  const handleRenameWheel = async (newName: string) => {
    if (!renameTarget) return;
    const wheelData = await getWheelById(renameTarget.id);
    if (wheelData) {
      await updateWheel({ ...wheelData, name: newName });
      setWheels(wheels =>
        wheels.map(w =>
          w.id === renameTarget.id ? { ...w, name: newName } : w
        )
      );
    }
    showToast('Wheel name successfully changed!', 'success');
    closeRenameModal();
  };

  // Function to load the first page of wheels
  const loadInitialWheels = useCallback(async () => {
    try {
      setInitialLoading(true);
      const { wheels: fetchedWheels, lastDoc: lastVisible, hasMore: moreAvailable } = await getWheelsPage(5);
      
      const wheelSummaries = fetchedWheels.map(wheel => ({
        id: wheel.id,
        name: wheel.name,
        itemsCount: wheel.items?.length || 0,
        createdAt: wheel.createdAt
      }));
      
      setWheels(wheelSummaries);
      setLastDoc(lastVisible);
      setHasMore(moreAvailable);
    } catch (error) {
      console.error('Error fetching initial wheels:', error);
      showToast('Failed to load wheels', 'error');
      setWheels([]);
      setHasMore(false);
    } finally {
      setInitialLoading(false);
    }
  }, [showToast]);
  
  // Function to load more wheels when scrolling
  const loadMoreWheels = useCallback(async () => {
    if (!hasMore || loadingMore || !lastDoc) return;
    
    try {
      setLoadingMore(true);
      const { wheels: fetchedWheels, lastDoc: lastVisible, hasMore: moreAvailable } = 
        await getWheelsPage(5, lastDoc);
      
      const wheelSummaries = fetchedWheels.map(wheel => ({
        id: wheel.id,
        name: wheel.name,
        itemsCount: wheel.items?.length || 0,
        createdAt: wheel.createdAt
      }));
      
      setWheels(prev => [...prev, ...wheelSummaries]);
      setLastDoc(lastVisible);
      setHasMore(moreAvailable);
    } catch (error) {
      console.error('Error fetching more wheels:', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, lastDoc, loadingMore]);
  
  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreWheels();
        }
      },
      { threshold: 0.1 }
    );
    
    observerRef.current = observer;
    
    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }
    
    return () => {
      if (currentLoadingRef && observerRef.current) {
        observerRef.current.unobserve(currentLoadingRef);
      }
    };
  }, [hasMore, loadingMore, loadMoreWheels]);
  
  // Load initial wheels on component mount
  useEffect(() => {
    loadInitialWheels();
  }, [loadInitialWheels]);

  if (initialLoading) {
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
      
      {/* Search Bar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mb: 3,
        mt: 1
      }}>
        <SearchBar />
      </Box>
      {wheels.length === 0 ? (
        <Typography sx={{ color: 'text.secondary', fontSize: 18, mt: 2 }}>
          No wheels found in the database.
        </Typography>
      ) : (
        <>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontSize: { xs: 12, sm: 15 }, color: 'text.secondary', fontFamily: 'inherit', textAlign: 'left', ml: 0, pl: 0 }}>
                    {wheel.itemsCount} items
                  </Typography>
                  {wheel.createdAt && (
                    <Typography sx={{ fontSize: { xs: 11, sm: 14 }, color: 'text.secondary', fontFamily: 'inherit', opacity: 0.8 }}>
                      Created: {formatDate(wheel.createdAt)}
                    </Typography>
                  )}
                </Box>
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
          
          {/* Loading indicator at the bottom */}
          {hasMore && (
            <Box 
              ref={loadingRef}
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                my: 3,
                opacity: 0.7
              }}
            >
              <CircularProgress size={24} thickness={4} />
            </Box>
          )}
        </>
      )}
    {/* Modal for renaming wheel */}
    <RenameWheelModal
      open={renameModalOpen}
      onClose={closeRenameModal}
      initialName={renameTarget?.name || ''}
      onSave={handleRenameWheel}
    />
  </Box>
  );
};

export default WheelsBrowserPage;
