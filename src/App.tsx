import { useState } from 'react'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import WheelPage from './pages/WheelPage'
import SettingsPage from './pages/SettingsPage'
import { takeScreenshot } from './utils/screenshot'
import { TeamMember, SpinStats } from './types'
import { defaultTeamMembers } from './constants/wheelConfig'
import { ToastProvider, useToast } from './components/ui/ToastProvider'
import './App.css'

const theme = createTheme({
  palette: {
    mode: 'light',
  },
})

function App() {
  const [currentPage, setCurrentPage] = useState<'wheel' | 'settings'>('wheel')
  const [spinStats, setSpinStats] = useState<SpinStats>({ count: 0, lastSpinTime: null })
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('teamMembers')
    return saved ? JSON.parse(saved) : defaultTeamMembers
  })

  const handleSaveTeamMembers = (members: TeamMember[]) => {
    setTeamMembers(members)
    localStorage.setItem('teamMembers', JSON.stringify(members))
    setCurrentPage('wheel')
  }

  const handleSpinComplete = () => {
    const newStats = {
      count: spinStats.count + 1,
      lastSpinTime: new Date().toLocaleString('uk-UA')
    }
    setSpinStats(newStats)
    localStorage.setItem('spinStats', JSON.stringify(newStats))
  }

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

// Separate component to use toast hook
interface AppContentProps {
  currentPage: 'wheel' | 'settings';
  setCurrentPage: (page: 'wheel' | 'settings') => void;
  teamMembers: TeamMember[];
  spinStats: SpinStats;
  handleSpinComplete: () => void;
  handleSaveTeamMembers: (members: TeamMember[]) => void;
}

function AppContent({ currentPage, setCurrentPage, teamMembers, spinStats, handleSpinComplete, handleSaveTeamMembers }: AppContentProps) {
  const { showToast } = useToast();

  const handleScreenshot = async () => {
    const ok = await takeScreenshot();
    if (ok) {
      showToast('Скріншот скопійовано в буфер обміну!', 'success');
    } else {
      showToast('Не вдалося скопіювати скріншот. Ваш браузер може не підтримувати цю функцію.', 'error');
    }
  };

  return currentPage === 'wheel' ? (
    <WheelPage
      teamMembers={teamMembers}
      spinStats={spinStats}
      onSettingsClick={() => setCurrentPage('settings')}
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

}

export default App
