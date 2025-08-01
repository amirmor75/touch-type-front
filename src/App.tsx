import { useEffect, useState } from 'react'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Alert,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material'
import TypingTrainer from './components/TypingTrainer'
import './App.css'

// Create a custom dark theme for the typing trainer
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bb86fc',
    },
    secondary: {
      main: '#03dac6',
    },
    background: {
      default: '#0f0f23',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#e8eaed',
      secondary: '#a0a0a0',
    },
    error: {
      main: '#cf6679',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
      color: '#bb86fc',
    },
    h6: {
      fontWeight: 600,
      color: '#e8eaed',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '100vh',
        },
      },
    },
  },
})

function App() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading')

  useEffect(() => {
    // Check API connection with better error handling
    const checkApiConnection = async () => {
      try {
        const response = await fetch("http://localhost:8000/ping")
        if (response.ok) {
          const data = await response.json()
          console.log('API Response:', data)
          setApiStatus('connected')
        } else {
          throw new Error('API not responding')
        }
      } catch (error) {
        console.error('Failed to connect to API:', error)
        setApiStatus('error')
      }
    }

    checkApiConnection()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        <AppBar 
          position="static" 
          sx={{ 
            background: 'linear-gradient(90deg, #1a1a2e, #16213e)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(187, 134, 252, 0.3)'
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ 
              flexGrow: 1, 
              fontFamily: "'Fira Code', monospace",
              color: '#bb86fc',
              fontWeight: 'bold'
            }}>
              &gt; touch-type-trainer.exe
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {apiStatus === 'loading' && (
                <CircularProgress 
                  size={20} 
                  sx={{ color: '#03dac6' }} 
                />
              )}
              {apiStatus === 'connected' && (
                <Typography variant="caption" sx={{ 
                  color: '#4caf50',
                  fontFamily: "'Fira Code', monospace",
                  fontWeight: 'bold'
                }}>
                  ● ONLINE
                </Typography>
              )}
              {apiStatus === 'error' && (
                <Typography variant="caption" sx={{ 
                  color: '#cf6679',
                  fontFamily: "'Fira Code', monospace",
                  fontWeight: 'bold'
                }}>
                  ● OFFLINE
                </Typography>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 0 }}>
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{
              background: 'linear-gradient(45deg, #bb86fc, #03dac6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Fira Code', monospace",
              textShadow: '0 0 30px rgba(187, 134, 252, 0.3)'
            }}>
              &lt;/&gt; ENHANCE YOUR CODING SPEED
            </Typography>
            <Typography variant="subtitle1" align="center" sx={{ 
              mb: 4,
              color: '#a0a0a0',
              fontFamily: "'Fira Code', monospace"
            }}>
              ./train --typing-speed --accuracy ++
            </Typography>

            {apiStatus === 'error' && (
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 3,
                  background: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  color: '#ff9800'
                }}
              >
                API connection failed. Running in offline mode.
              </Alert>
            )}

            <TypingTrainer />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
