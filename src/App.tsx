import React, { useState } from 'react'

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


  function WheelPageWrapper() {
    const { id } = useParams<{ id: string }>();
    // Локальний стейт для items та spinStats
    const [localItems, setLocalItems] = React.useState<WheelItem[]>([]);
    const [localSpinStats, setLocalSpinStats] = React.useState<SpinStats>({ count: 0, lastSpinTime: null });
    const [loading, setLoading] = React.useState<boolean>(!!id);
    const [notFound, setNotFound] = React.useState<boolean>(false);

    // Завантажуємо дані з бази лише при монтуванні/зміні id
    React.useEffect(() => {
      let isMounted = true;
      if (id) {
        setLoading(true);
        setNotFound(false);
        getWheelById(id).then((data) => {
          if (isMounted) {
            if (data) {
              setLocalItems(data.items || []);
              setLocalSpinStats(data.spinStats || { count: 0, lastSpinTime: null });
              setLoading(false);
            } else {
              setNotFound(true);
              setLoading(false);
            }
          }
        });
      } else {
        setLocalItems(items);
        setLocalSpinStats(spinStats);
        setLoading(false);
        setNotFound(false);
      }
      return () => { isMounted = false; };
    }, [id]);

    // Зберігаємо дані у базу при кожній зміні локального стейту
    const saveToDb = React.useCallback((itemsToSave: WheelItem[], statsToSave: SpinStats) => {
      const newWheel = {
        id: id || 'local',
        name: id ? `Wheel ${id}` : 'Local Wheel',
        items: itemsToSave,
        spinStats: statsToSave,
      };
      saveWheel(newWheel);
    }, [id]);

    // Хендлери для змін
    const handleSpin = () => {
      const newStats = {
        count: localSpinStats.count + 1,
        lastSpinTime: new Date().toLocaleString('uk-UA')
      };
      setLocalSpinStats(newStats);
      saveToDb(localItems, newStats);
    };
    const handleItemsChange = (newItems: WheelItem[]) => {
      setLocalItems(newItems);
      saveToDb(newItems, localSpinStats);
    };

    if (loading) return <div style={{textAlign:'center',marginTop:80,fontSize:22}}>Loading...</div>;
    if (notFound) {
      return <NotFoundPage />;
    }

    return (
      <WheelPage
        id={id}
        items={localItems}
        spinStats={localSpinStats}
        onSpinComplete={handleSpin}
        onItemsChange={handleItemsChange}
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
