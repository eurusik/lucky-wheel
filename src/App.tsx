import React, { useState } from 'react'

import WheelPage from './pages/WheelPage';
import WheelsBrowserPage from './pages/WheelsBrowserPage';

import HomePage from './pages/HomePage';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

import { WheelItem, SpinStats } from './types';
import { createTheme as createMuiTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import { ToastProvider } from './components/ui/ToastProvider';
import NotFoundPage from './pages/NotFoundPage';
import { getWheelById, saveWheel } from './utils/wheelDataProvider';
import Loader from './components/ui/Loader';

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

function App() {
  const [loading, setLoading] = useState(true);

  // Load wheel from provider on mount
  React.useEffect(() => {
    let isMounted = true;
    async function loadLocalWheel() {
      // Try to get wheel with id 'local' (or fallback to localStorage for legacy)
      const localWheel = await getWheelById('local');
      if (localWheel) {
        if (isMounted) {
          setLoading(false);
        }
      } else {
        // fallback to defaults
        setLoading(false);
      }
    }
    loadLocalWheel();
    return () => { isMounted = false; };
  }, []);


  function WheelPageWrapper() {
    const { id } = useParams<{ id: string }>();
    // Local state for items and spinStats
    const [localItems, setLocalItems] = React.useState<WheelItem[]>([]);
    const [localSpinStats, setLocalSpinStats] = React.useState<SpinStats>({ count: 0, lastSpinTime: null });
    const [localName, setLocalName] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(!!id);
    const [notFound, setNotFound] = React.useState<boolean>(false);

    // Load data from the database only when mounting/changing id
    React.useEffect(() => {
      if (!id) return;
      setLoading(true);
      let isMounted = true;
      getWheelById(id).then((data) => {
        if (!isMounted) return;
        if (data) {
          setLocalItems(data.items || []);
          setLocalSpinStats(data.spinStats || { count: 0, lastSpinTime: null });
          setLocalName(data.name || '');
          setNotFound(false);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
      return () => { isMounted = false; };
    }, [id]);

    // Save data to the database with each change of the local state
    const saveToDb = React.useCallback((itemsToSave: WheelItem[], statsToSave: SpinStats, nameToSave?: string) => {
      let finalName = nameToSave ?? localName;
      if (id) {
        // For updates, fetch the existing wheel and use its name unless overridden
        const existing = window.localStorage.getItem('wheels');
        if (existing) {
          try {
            const all = JSON.parse(existing);
            if (all && all[id] && all[id].name && !nameToSave) {
              finalName = all[id].name;
            }
          } catch {
            // ignore
          }
        }
      }
      const newWheel = {
        id: id || 'local',
        name: finalName,
        items: itemsToSave,
        spinStats: statsToSave,
      };
      saveWheel(newWheel);
    }, [id, localName]);

    // Handlers for changes
    const handleSpin = () => {
      const newStats = {
        count: localSpinStats.count + 1,
        lastSpinTime: new Date().toLocaleString('uk-UA')
      };
      setLocalSpinStats(newStats);
      saveToDb(localItems, newStats);
    };

    const handleWheelSettingsChange = (items: WheelItem[], name: string) => {
      setLocalItems(items);
      setLocalName(name);
      saveToDb(items, localSpinStats, name);
    };


    if (loading) return <Loader label="Loading wheel..." />;
    if (notFound) {
      return <NotFoundPage />;
    }

    return (
      <WheelPage
        id={id}
        name={localName}
        items={localItems}
        spinStats={localSpinStats}
        onSpinComplete={handleSpin}
        onWheelSettingsChange={handleWheelSettingsChange}
      />
    );
  }

  if (loading) {
    return <Loader label="Loading wheel..." />;
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wheels-browser" element={<WheelsBrowserPage />} />
            <Route path=":id" element={<WheelPageWrapper />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}


export default App
