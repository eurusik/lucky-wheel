import React, { useState, useEffect, useRef } from 'react';
import { Box, InputBase, Paper, List, ListItem, ListItemText, Popper, ClickAwayListener, IconButton, Fade, Modal, useMediaQuery, useTheme, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { getAllWheels } from '../../utils/wheelDataProvider';
import { FirestoreWheelData } from '../../utils/wheelFirestore';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [wheels, setWheels] = useState<FirestoreWheelData[]>([]);
  const [filteredWheels, setFilteredWheels] = useState<FirestoreWheelData[]>([]);
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));



  // Initial load of wheels
  useEffect(() => {
    const fetchWheels = async () => {
      try {
        const allWheels = await getAllWheels();
        setWheels(allWheels);
      } catch (error) {
        console.error('Error fetching wheels:', error);
      }
    };
    
    fetchWheels();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Filter wheels regardless of whether we're in mobile or desktop mode
    if (value.trim() === '') {
      setFilteredWheels([]);
      setOpen(false);
    } else {
      const filtered = wheels.filter(wheel => 
        wheel.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredWheels(filtered);
      
      // Only set open for desktop view, mobile view shows results directly in overlay
      if (!isMobile) {
        setOpen(filtered.length > 0);
      }
    }
  };

  const handleWheelSelect = (wheelId: string) => {
    navigate(`/${wheelId}`);
    setSearchTerm('');
    setOpen(false);
  };

  const handleClickAway = () => {
    setOpen(false);
    if (isMobile) {
      setMobileSearchOpen(false);
    }
  };

  const handleMobileSearchOpen = () => {
    setMobileSearchOpen(true);
  };

  const handleMobileSearchClose = () => {
    setMobileSearchOpen(false);
    setSearchTerm('');
    setOpen(false);
  };

  // Mobile search overlay
  const mobileSearchOverlay = (
    <Modal
      open={mobileSearchOpen}
      onClose={handleMobileSearchClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)',
      }}
    >
      <Fade in={mobileSearchOpen}>
        <Box
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            pt: 1,
            pb: 2,
            mt: 0,
            borderRadius: '0 0 16px 16px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              autoFocus
              placeholder="Search wheels..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ 
                flex: 1,
                fontSize: '1rem',
                '& .MuiInputBase-input': {
                  padding: '8px 0',
                }
              }}
            />
            <IconButton size="small" onClick={handleMobileSearchClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Search results */}
          {searchTerm.trim() !== '' && (
            <Box sx={{ mt: 2 }}>
              {filteredWheels.length > 0 ? (
                <List dense sx={{ padding: 0, backgroundColor: '#f5f5f5' }}>
                  {filteredWheels.map((wheel, index) => (
                    <ListItem 
                      key={wheel.id}
                      onClick={() => handleWheelSelect(wheel.id)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.08)',
                        },
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: index < filteredWheels.length - 1 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
                        backgroundColor: 'white'
                      }}
                    >
                      <ListItemText 
                        primary={wheel.name}
                        primaryTypographyProps={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#212121'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary" fontSize="1rem">
                    No wheels found
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );

  // Render different UI based on screen size
  if (isMobile) {
    return (
      <>
        <IconButton 
          onClick={handleMobileSearchOpen}
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary' }} />
        </IconButton>
        {mobileSearchOverlay}
      </>
    );
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box 
        ref={searchRef}
        sx={{ 
          position: 'relative',
          width: '100%',
          maxWidth: 300,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '30px',
            padding: '2px 12px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="Search wheels..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => searchTerm.trim() !== '' && setOpen(true)}
            sx={{ 
              flex: 1,
              fontSize: '0.9rem',
              '& .MuiInputBase-input': {
                padding: '8px 0',
              }
            }}
          />
        </Paper>

        <Popper
          open={open}
          anchorEl={searchRef.current}
          placement="bottom-start"
          style={{ 
            width: searchRef.current?.clientWidth,
            zIndex: 1300,
            marginTop: 4
          }}
        >
          <Paper 
            elevation={3}
            sx={{ 
              maxHeight: 300, 
              overflow: 'auto',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            <List dense sx={{ padding: 0 }}>
              {filteredWheels.length > 0 ? (
                filteredWheels.map((wheel) => (
                  <ListItem 
                    key={wheel.id}
                    onClick={() => handleWheelSelect(wheel.id)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                      padding: '8px 16px',
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemText 
                      primary={wheel.name}
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem sx={{ padding: '8px 16px' }}>
                  <ListItemText 
                    primary="No wheels found"
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      color: 'text.secondary',
                    }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
