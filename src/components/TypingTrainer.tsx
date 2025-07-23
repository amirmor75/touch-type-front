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

const TEXT_TO_TYPE = "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is perfect for typing practice.";

export default function TypingTrainer() {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (startTime && input.length > 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      const currentWpm = calculateWPM(input.length, elapsed);
      setWpm(currentWpm);
      
      // Calculate accuracy
      const correctChars = input.split('').filter((char, index) => 
        char === TEXT_TO_TYPE[index]
      ).length;
      const currentAccuracy = input.length > 0 ? (correctChars / input.length) * 100 : 100;
      setAccuracy(Math.round(currentAccuracy));

      // Check if completed
      if (input === TEXT_TO_TYPE) {
        setIsCompleted(true);
      }
    }
  }, [input, startTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startTime) setStartTime(Date.now());
    setInput(e.target.value);
  };

  const resetTest = () => {
    setInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
  };

  const progress = (input.length / TEXT_TO_TYPE.length) * 100;

  // Render text with correct/incorrect highlighting
  const renderTextWithHighlight = () => {
    return TEXT_TO_TYPE.split('').map((char, index) => {
      const color = 'text.primary';
      let backgroundColor = 'transparent';
      
      if (index < input.length) {
        if (input[index] === char) {
          backgroundColor = '#e8f5e8'; // Light green for correct
        } else {
          backgroundColor = '#ffebee'; // Light red for incorrect
        }
      } else if (index === input.length) {
        backgroundColor = '#e3f2fd'; // Light blue for current position
      }

      return (
        <span 
          key={index} 
          style={{ 
            backgroundColor,
            color: color === 'text.primary' ? 'inherit' : color 
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {/* Progress and Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              {wpm}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Words Per Minute
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color={accuracy >= 95 ? "success.main" : accuracy >= 80 ? "warning.main" : "error.main"}>
              {accuracy}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Accuracy
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="info.main">
              {Math.round(progress)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Main Typing Area */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Type the text below:
          </Typography>
          {isCompleted && (
            <Chip label="Completed!" color="success" size="small" />
          )}
        </Box>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            fontFamily: "monospace", 
            fontSize: '1.1rem',
            lineHeight: 1.6,
            padding: 2,
            backgroundColor: '#fafafa',
            borderRadius: 1,
            border: '1px solid #e0e0e0'
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
          placeholder="Start typing here..."
          disabled={isCompleted}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: 'monospace',
              fontSize: '1.1rem',
            }
          }}
        />
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Characters: {input.length} / {TEXT_TO_TYPE.length}
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            onClick={resetTest}
            size="small"
          >
            Reset Test
          </Button>
        </Box>
      </Paper>

      {isCompleted && (
        <Paper sx={{ p: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
          <Typography variant="h6" gutterBottom>
            🎉 Congratulations!
          </Typography>
          <Typography variant="body1">
            You completed the test with {wpm} WPM and {accuracy}% accuracy!
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
