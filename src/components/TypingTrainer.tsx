import { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Paper, 
  Button, 
  Card, 
  CardContent,
  LinearProgress,
  Chip
} from "@mui/material";
import { calculateWPM } from "../utils/wpm";
import VirtualKeyboard from "./VirtualKeyboard";

interface TypingError {
  position: number;
  expectedChar: string;
  typedChar: string;
  timestamp: number;
}

export default function TypingTrainer() {
  const [textToType, setTextToType] = useState("");
  const [input, setInput] = useState("");
  const [currentPosition, setCurrentPosition] = useState(0); // Track actual typing position
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errors, setErrors] = useState<TypingError[]>([]);
  const [lastTypedChar, setLastTypedChar] = useState<string>('');

  useEffect(() => {
    // Fetch initial text to type
    fetch("http://localhost:8000/drill")
      .then(res => res.json())
      .then(data => setTextToType(data.text))
      .catch(err => console.error("Error fetching text:", err));
  }, []);

  useEffect(() => {
    if (startTime && currentPosition > 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      const currentWpm = calculateWPM(currentPosition, elapsed);
      setWpm(currentWpm);
      
      // Calculate accuracy based on correct characters vs total attempts
      const totalAttempts = currentPosition + errors.length;
      const currentAccuracy = totalAttempts > 0 ? (currentPosition / totalAttempts) * 100 : 100;
      setAccuracy(Math.round(currentAccuracy));

      // Check if completed
      if (currentPosition === textToType.length) {
        setIsCompleted(true);
      }
    }
  }, [currentPosition, startTime, textToType, errors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Prevent pasting more characters than typed sequentially
    if (newValue.length > input.length + 1) {
      return; // Block paste operations
    }
    
    if (newValue.length > input.length) {
      // User typed a new character
      const typedChar = newValue[newValue.length - 1];
      const expectedChar = textToType[currentPosition];
      
      if (!startTime) setStartTime(Date.now());
      setLastTypedChar(typedChar);
      
      if (typedChar === expectedChar) {
        // Correct character
        setInput(newValue);
        setCurrentPosition(currentPosition + 1);
      } else {
        // Wrong character - record error but don't advance
        const error: TypingError = {
          position: currentPosition,
          expectedChar,
          typedChar,
          timestamp: Date.now()
        };
        setErrors(prev => [...prev, error]);
        // Don't update input or advance position
      }
    } else if (newValue.length < input.length) {
      // Backspace pressed - allow going back
      const newPosition = Math.max(0, currentPosition - (input.length - newValue.length));
      setInput(newValue);
      setCurrentPosition(newPosition);
      setLastTypedChar('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent common cheating methods
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'v' || e.key === 'a' || e.key === 'c' || e.key === 'x') {
        e.preventDefault();
        return;
      }
    }
    
    // Prevent right-click context menu
    if (e.key === 'ContextMenu') {
      e.preventDefault();
    }
  };

  const resetTest = () => {
    setInput("");
    setCurrentPosition(0);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    setErrors([]);
    setLastTypedChar('');
  };

  const progress = (currentPosition / textToType.length) * 100;

  // Get the next character to type for keyboard highlighting
  const nextCharToType = currentPosition < textToType.length ? textToType[currentPosition] : '';

  // Render text with correct/incorrect highlighting and newline handling
  const renderTextWithHighlight = () => {
    return textToType.split('').map((char, index) => {
      let backgroundColor = 'transparent';
      let textDecoration = 'none';
      
      if (index < currentPosition) {
        backgroundColor = '#1a4b3a'; // Dark green for correct (completed)
      } else if (index === currentPosition) {
        backgroundColor = '#1e3a5f'; // Dark blue for current position
        textDecoration = 'underline';
      }

      // Handle newlines with enter emoji and actual line break
      if (char === '\n') {
        return (
          <span key={index}>
            <span 
              style={{ 
                backgroundColor,
                display: 'inline-block',
                minWidth: '30px',
                textAlign: 'center',
                textDecoration,
                color: '#bb86fc',
                fontWeight: 'bold'
              }}
            >
              ⏎
            </span>
            <br />
          </span>
        );
      }

      // Handle spaces more visibly - FIX: Use consistent width and vertical alignment
      if (char === ' ') {
        return (
          <span 
            key={index} 
            style={{ 
              backgroundColor,
              textDecoration,
              display: 'inline-block',
              width: '8px', // Fixed width instead of minWidth
              height: '1.2em', // Consistent height
              
              borderBottom: textDecoration === 'underline' ? '2px solid #bb86fc' : 'none',
              marginBottom: '7.5px',
              verticalAlign: 'bottom',
            }}
          >
            &nbsp;
          </span>
        );
      }

      return (
        <span 
          key={index} 
          style={{ 
            backgroundColor,
            textDecoration,
            color: backgroundColor !== 'transparent' ? '#e8eaed' : 'inherit'
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <Box sx={{ 
      maxWidth: 1000, 
      mx: "auto",
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      minHeight: '100vh',
      p: 3,
      color: '#e8eaed'
    }}>
      {/* Progress and Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ 
          flex: 1, 
          minWidth: 200,
          background: 'linear-gradient(145deg, #1e1e3f, #2a2a5a)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(187, 134, 252, 0.3)'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#bb86fc', fontWeight: 'bold' }}>
              {wpm}
            </Typography>
            <Typography variant="caption" sx={{ color: '#a0a0a0' }}>
              Words Per Minute
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ 
          flex: 1, 
          minWidth: 200,
          background: 'linear-gradient(145deg, #1e1e3f, #2a2a5a)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(187, 134, 252, 0.3)'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ 
              color: accuracy >= 95 ? "#4caf50" : accuracy >= 80 ? "#ff9800" : "#f44336",
              fontWeight: 'bold'
            }}>
              {accuracy}%
            </Typography>
            <Typography variant="caption" sx={{ color: '#a0a0a0' }}>
              Accuracy
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ 
          flex: 1, 
          minWidth: 200,
          background: 'linear-gradient(145deg, #1e1e3f, #2a2a5a)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(187, 134, 252, 0.3)'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#03dac6', fontWeight: 'bold' }}>
              {Math.round(progress)}%
            </Typography>
            <Typography variant="caption" sx={{ color: '#a0a0a0' }}>
              Progress
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ 
          flex: 1, 
          minWidth: 200,
          background: 'linear-gradient(145deg, #1e1e3f, #2a2a5a)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(187, 134, 252, 0.3)'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#cf6679', fontWeight: 'bold' }}>
              {errors.length}
            </Typography>
            <Typography variant="caption" sx={{ color: '#a0a0a0' }}>
              Errors
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #bb86fc, #03dac6)'
            }
          }}
        />
      </Box>

      {/* Main Typing Area */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(187, 134, 252, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#bb86fc', fontWeight: 'bold' }}>
            &gt; Type the text below:
          </Typography>
          {isCompleted && (
            <Chip 
              label="COMPLETED!" 
              sx={{ 
                background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          )}
        </Box>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace", 
            fontSize: '1.1rem',
            lineHeight: 2,
            padding: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: 2,
            border: '1px solid rgba(187, 134, 252, 0.2)',
            whiteSpace: 'pre-wrap',
            color: '#e8eaed'
          }}
        >
          {renderTextWithHighlight()}
        </Typography>
        
        <TextField
          fullWidth
          multiline
          minRows={3}
          variant="outlined"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onContextMenu={(e) => e.preventDefault()}
          placeholder="Start typing here... (Copy/Paste disabled)"
          disabled={isCompleted}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
              fontSize: '1.1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              color: '#e8eaed',
              '& fieldset': {
                borderColor: 'rgba(187, 134, 252, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(187, 134, 252, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#bb86fc',
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#a0a0a0',
            }
          }}
        />
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#a0a0a0' }}>
              Position: {currentPosition} / {textToType.length} | Errors: {errors.length}
            </Typography>
            <Typography variant="caption" sx={{ ml: 2, color: '#ff6b35' }}>
              ⚠️ Copy/Paste disabled for fair practice
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            onClick={resetTest}
            size="small"
            sx={{
              color: '#bb86fc',
              borderColor: '#bb86fc',
              '&:hover': {
                borderColor: '#03dac6',
                backgroundColor: 'rgba(3, 218, 198, 0.1)'
              }
            }}
          >
            Reset Test
          </Button>
        </Box>
      </Paper>

      {/* Virtual Keyboard */}
      <VirtualKeyboard nextChar={nextCharToType} lastTypedChar={lastTypedChar} />

      {isCompleted && (
        <Paper sx={{ 
          p: 3, 
          background: 'linear-gradient(145deg, #1a4b3a, #2e7d32)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          boxShadow: '0 8px 32px rgba(76, 175, 80, 0.2)'
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold' }}>
            🎉 MISSION ACCOMPLISHED!
          </Typography>
          <Typography variant="body1" sx={{ color: '#e8eaed' }}>
            Code execution successful: {wpm} WPM | Accuracy: {accuracy}% | Errors: {errors.length}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}