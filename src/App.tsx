import { useState, useCallback } from 'react'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import WheelPage from './pages/WheelPage'
import SettingsPage from './pages/SettingsPage'
import { takeScreenshot } from './utils/screenshot'
import { TeamMember, SpinStats } from './types'
import { defaultTeamMembers } from './constants/wheelConfig'
import { ToastProvider, useToast } from './components/ui/ToastProvider'
import { BREAKPOINTS } from './constants/styleConfig'
import './App.css'

const theme = createTheme({
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
  TEAM_MEMBERS: 'teamMembers',
  SPIN_STATS: 'spinStats'
} as const

function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
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
    getStoredData(STORAGE_KEYS.SPIN_STATS, { count: 0, lastSpinTime: null })
  )
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => 
    getStoredData(STORAGE_KEYS.TEAM_MEMBERS, defaultTeamMembers)
  )

  const handleSaveTeamMembers = useCallback((members: TeamMember[]) => {
    setTeamMembers(members)
    setStoredData(STORAGE_KEYS.TEAM_MEMBERS, members)
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
          teamMembers={teamMembers}
          spinStats={spinStats}
          handleSpinComplete={handleSpinComplete}
          handleSaveTeamMembers={handleSaveTeamMembers}
        />
      </ThemeProvider>
    </ToastProvider>
  )
}

interface AppContentProps {
  currentPage: 'wheel' | 'settings';
  setCurrentPage: (page: 'wheel' | 'settings') => void;
  teamMembers: TeamMember[];
  spinStats: SpinStats;
  handleSpinComplete: () => void;
  handleSaveTeamMembers: (members: TeamMember[]) => void;
}

function AppContent({ 
  currentPage, 
  setCurrentPage, 
  teamMembers, 
  spinStats, 
  handleSpinComplete, 
  handleSaveTeamMembers 
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
      items={teamMembers}
      spinStats={spinStats}
      onSettingsClick={handleSettingsClick}
      onSpinComplete={handleSpinComplete}
      onScreenshot={handleScreenshot}
    />
  ) : (
    <SettingsPage
      teamMembers={teamMembers}
      onSave={handleSaveTeamMembers}
    />
  );
}

export default App
