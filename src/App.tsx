import { useState, useCallback } from 'react'

import WheelPage from './pages/WheelPage'
import { useMemo } from 'react';
import HomePage from './pages/HomePage';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { getWheelById } from './utils/wheelStorage';
import { WheelItem, SpinStats } from './types';
import { defaultTeamMembers } from './constants/wheelConfig';
import './App.css'
import { createTheme as createMuiTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import { ToastProvider } from './components/ui/ToastProvider';

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

const STORAGE_KEYS = {
  ITEMS: 'wheelItems',
  SPIN_STATS: 'spinStats',
} as const

const DEFAULT_VALUES = {
  SPIN_STATS: { count: 0, lastSpinTime: null },
  ITEMS: defaultTeamMembers
} as const

function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key)
    if (saved === null) {
      setStoredData(key, defaultValue)
      return defaultValue
    }
    return JSON.parse(saved)
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
    return defaultValue
  }
}

function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error)
  }
}

function App() {
  const [spinStats, setSpinStats] = useState<SpinStats>(() => 
    getStoredData(STORAGE_KEYS.SPIN_STATS, DEFAULT_VALUES.SPIN_STATS)
  );
  const [items, setItems] = useState<WheelItem[]>(() => 
    getStoredData(STORAGE_KEYS.ITEMS, DEFAULT_VALUES.ITEMS)
  );

  const handleSaveItems = useCallback((newItems: WheelItem[]) => {
    setItems(newItems);
    setStoredData(STORAGE_KEYS.ITEMS, newItems);
  }, []);

  const handleSpinComplete = useCallback(() => {
    const newStats = {
      count: spinStats.count + 1,
      lastSpinTime: new Date().toLocaleString('uk-UA')
    };
    setSpinStats(newStats);
    setStoredData(STORAGE_KEYS.SPIN_STATS, newStats);
  }, [spinStats.count]);

  function WheelPageWrapper() {
    const { id } = useParams<{ id: string }>();
    const wheelData = useMemo(() => (id ? getWheelById(id) : undefined), [id]);
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
