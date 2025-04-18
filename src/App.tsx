import { useState, useCallback } from 'react'

import WheelPage from './pages/WheelPage'
import SettingsPage from './pages/SettingsPage'
import { takeScreenshot } from './utils/screenshot'
import { WheelItem, SpinStats } from './types'
import { defaultTeamMembers } from './constants/wheelConfig'
import { ToastProvider, useToast } from './components/ui/ToastProvider'
import { BREAKPOINTS } from './constants/styleConfig'
import './App.css'
import { createTheme as createMuiTheme } from '@mui/material/styles'
import { ThemeProvider, CssBaseline } from '@mui/material'

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
  breakpoints: {
    values: {
      xs: 0,
      sm: BREAKPOINTS.MOBILE + 1,
      md: BREAKPOINTS.TABLET + 1,
      lg: BREAKPOINTS.DESKTOP,
      xl: 1920,
    },
  },
  palette: {
    mode: 'light',
  },
})

const STORAGE_KEYS = {
  ITEMS: 'wheelItems',
  SPIN_STATS: 'spinStats'
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
  const [currentPage, setCurrentPage] = useState<'wheel' | 'settings'>('wheel')
  const [spinStats, setSpinStats] = useState<SpinStats>(() => 
    getStoredData(STORAGE_KEYS.SPIN_STATS, DEFAULT_VALUES.SPIN_STATS)
  )
  const [items, setItems] = useState<WheelItem[]>(() => 
    getStoredData(STORAGE_KEYS.ITEMS, DEFAULT_VALUES.ITEMS)
  )

  const handleSaveItems = useCallback((newItems: WheelItem[]) => {
    setItems(newItems)
    setStoredData(STORAGE_KEYS.ITEMS, newItems)
    setCurrentPage('wheel')
  }, [])

  const handleSpinComplete = useCallback(() => {
    const newStats = {
      count: spinStats.count + 1,
      lastSpinTime: new Date().toLocaleString('uk-UA')
    }
    setSpinStats(newStats)
    setStoredData(STORAGE_KEYS.SPIN_STATS, newStats)
  }, [spinStats.count])

  return (
    <ToastProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          items={items}
          spinStats={spinStats}
          handleSpinComplete={handleSpinComplete}
          handleSaveItems={handleSaveItems}
        />
      </ThemeProvider>
    </ToastProvider>
  )
}

interface AppContentProps {
  currentPage: 'wheel' | 'settings';
  setCurrentPage: (page: 'wheel' | 'settings') => void;
  items: WheelItem[];
  spinStats: SpinStats;
  handleSpinComplete: () => void;
  handleSaveItems: (items: WheelItem[]) => void;
}

function AppContent({ 
  currentPage, 
  setCurrentPage, 
  items, 
  spinStats, 
  handleSpinComplete, 
  handleSaveItems 
}: AppContentProps) {
  const { showToast } = useToast();

  const handleScreenshot = useCallback(async () => {
    try {
      const ok = await takeScreenshot();
      if (ok) {
        showToast('Screenshot copied to clipboard!', 'success');
      } else {
        showToast('Failed to copy screenshot. Your browser may not support this feature.', 'error');
      }
    } catch (error) {
      console.error('Screenshot error:', error);
      showToast('An error occurred while taking the screenshot.', 'error');
    }
  }, [showToast]);

  const handleSettingsClick = useCallback(() => setCurrentPage('settings'), [setCurrentPage]);

  return currentPage === 'wheel' ? (
    <WheelPage
      items={items}
      spinStats={spinStats}
      onSettingsClick={handleSettingsClick}
      onSpinComplete={handleSpinComplete}
      onScreenshot={handleScreenshot}
      onItemsChange={handleSaveItems}
    />
  ) : (
    <SettingsPage
      items={items}
      onSave={handleSaveItems}
    />
  );
}

export default App
