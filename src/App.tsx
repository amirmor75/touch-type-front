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

// Create a custom theme for the typing trainer
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
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
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ⌨️ Touch Type Trainer
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {apiStatus === 'loading' && <CircularProgress size={20} color="inherit" />}
              {apiStatus === 'connected' && (
                <Typography variant="caption" color="inherit">
                  🟢 Connected
                </Typography>
              )}
              {apiStatus === 'error' && (
                <Typography variant="caption" color="inherit">
                  🔴 Offline
                </Typography>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg">
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Improve Your Typing Skills
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
              Practice typing to increase your speed and accuracy
            </Typography>

            {apiStatus === 'error' && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                API connection failed. Some features may not be available.
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
