import React, { useState, useCallback } from 'react'

import WheelPage from './pages/WheelPage'

import HomePage from './pages/HomePage';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

import { WheelItem, SpinStats } from './types';
import { defaultTeamMembers } from './constants/wheelConfig';
import './App.css'
import { createTheme as createMuiTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import { ToastProvider } from './components/ui/ToastProvider';
import NotFoundPage from './pages/NotFoundPage';
import { getWheelById, saveWheel } from './utils/wheelDataProvider';

const theme = createMuiTheme({
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&:focus': {
            outline: 'none',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:focus': {
            outline: 'none',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&:focus': {
            outline: 'none',
          },
        },
      },
    },
  },
  palette: {
    mode: 'light',
  },
})

const DEFAULT_VALUES = {
  SPIN_STATS: { count: 0, lastSpinTime: null },
  ITEMS: defaultTeamMembers
} as const

function App() {
  const [spinStats, setSpinStats] = useState<SpinStats>({ count: 0, lastSpinTime: null });
  const [items, setItems] = useState<WheelItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wheel from provider on mount
  React.useEffect(() => {
    let isMounted = true;
    async function loadLocalWheel() {
      // Try to get wheel with id 'local' (or fallback to localStorage for legacy)
      const localWheel = await getWheelById('local');
      if (localWheel) {
        if (isMounted) {
          setItems(localWheel.items || []);
          setSpinStats(localWheel.spinStats || { count: 0, lastSpinTime: null });
          setLoading(false);
        }
      } else {
        // fallback to defaults
        setItems(DEFAULT_VALUES.ITEMS);
        setSpinStats(DEFAULT_VALUES.SPIN_STATS);
        setLoading(false);
      }
    }
    loadLocalWheel();
    return () => { isMounted = false; };
  }, []);

  // Save items via provider
  const handleSaveItems = useCallback(async (newItems: WheelItem[]) => {
    setItems(newItems);
    const newWheel = {
      id: 'local',
      name: 'Local Wheel',
      items: newItems,
      spinStats,
    };
    await saveWheel(newWheel);
  }, [spinStats]);

  // Save stats via provider
  const handleSpinComplete = useCallback(async () => {
    const newStats = {
      count: spinStats.count + 1,
      lastSpinTime: new Date().toLocaleString('uk-UA')
    };
    setSpinStats(newStats);
    const newWheel = {
      id: 'local',
      name: 'Local Wheel',
      items,
      spinStats: newStats,
    };
    await saveWheel(newWheel);
  }, [spinStats, items]);

  function WheelPageWrapper() {
    const { id } = useParams<{ id: string }>();
    const [wheelData, setWheelData] = React.useState<import('./utils/wheelFirestore').FirestoreWheelData | null>(null);
    const [loading, setLoading] = React.useState<boolean>(!!id);

    React.useEffect(() => {
      let isMounted = true;
      if (id) {
        setLoading(true);
        getWheelById(id).then((data) => {
          if (isMounted) {
            setWheelData(data);
            setLoading(false);
          }
        });
      } else {
        setWheelData(null);
        setLoading(false);
      }
      return () => { isMounted = false; };
    }, [id]);

    if (loading) return <div style={{textAlign:'center',marginTop:80,fontSize:22}}>Loading...</div>;
    if (id && !wheelData) {
      return <NotFoundPage />;
    }
    const wheelItems = wheelData?.items || items;
    const wheelStats = wheelData?.spinStats || spinStats;

    return (
      <WheelPage
        items={wheelItems}
        spinStats={wheelStats}
        onSpinComplete={handleSpinComplete}
        onItemsChange={handleSaveItems}
      />
    );
  }

  if (loading) {
    return <div style={{textAlign:'center',marginTop:80,fontSize:22}}>Loading...</div>;
  }

  return (
    <ToastProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path=":id" element={<WheelPageWrapper />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App
