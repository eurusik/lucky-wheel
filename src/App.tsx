import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme as appTheme } from './theme';
import { HomePage } from './pages/HomePage';
import { WheelViewPage } from './pages/WheelViewPage';
import { WheelNotFoundPage } from './pages/WheelNotFoundPage';
import { useState, useCallback } from 'react'
import WheelPage from './pages/WheelPage'
import SettingsPage from './pages/SettingsPage'
import { takeScreenshot } from './utils/screenshot'
import { WheelItem, SpinStats } from './types'
import { defaultTeamMembers } from './constants/wheelConfig'
import { ToastProvider } from './components/ui/ToastProvider'
import { BREAKPOINTS } from './constants/styleConfig'
import './App.css'
import { createTheme as createMuiTheme } from '@mui/material/styles'

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
  ITEMS: []
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

const App: React.FC = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wheel/:wheelId" element={<WheelViewPage />} />
            <Route path="/wheel-not-found" element={<WheelNotFoundPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App
