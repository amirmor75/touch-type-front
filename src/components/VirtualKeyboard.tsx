import { Box, Paper } from "@mui/material";

interface VirtualKeyboardProps {
  nextChar: string;
  lastTypedChar: string;
}

const VirtualKeyboard = ({ nextChar, lastTypedChar }: VirtualKeyboardProps) => {
  // Define keyboard layout
  const keyboardRows = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
  ];

  // Map special characters to their key representations
  const charToKeyMap: { [key: string]: string } = {
    ' ': 'Space',
    '\n': 'Enter',
    '\t': 'Tab',
    // Add more mappings as needed
  };

  const getKeyToHighlight = (char: string): string => {
    if (charToKeyMap[char]) {
      return charToKeyMap[char];
    }
    return char.toLowerCase();
  };

  const nextKey = getKeyToHighlight(nextChar);
  const lastKey = getKeyToHighlight(lastTypedChar);

  const getKeyStyles = (key: string) => {
    const isNextKey = key.toLowerCase() === nextKey || key === nextKey;
    const isLastTyped = key.toLowerCase() === lastKey || key === lastKey;
    const isSpecialKey = ['Backspace', 'Tab', 'CapsLock', 'Enter', 'Shift', 'Ctrl', 'Win', 'Alt', 'Space', 'Menu'].includes(key);
    
    // Priority: Next key > Last typed > Normal
    let background, color, border, boxShadow;
    
    if (isNextKey) {
      // Next key to type - bright highlight
      background = 'linear-gradient(145deg, #bb86fc, #03dac6)';
      color = '#000';
      border = '2px solid #03dac6';
      boxShadow = '0 0 20px rgba(3, 218, 198, 0.5), 0 0 40px rgba(187, 134, 252, 0.3)';
    } else if (isLastTyped && lastTypedChar) {
      // Last typed key - orange/yellow highlight
      background = 'linear-gradient(145deg, #ff9800, #ffc107)';
      color = '#000';
      border = '2px solid #ff9800';
      boxShadow = '0 0 15px rgba(255, 152, 0, 0.5)';
    } else if (isSpecialKey) {
      // Special keys
      background = 'linear-gradient(145deg, #2a2a5a, #1e1e3f)';
      color = '#e8eaed';
      border = '1px solid rgba(187, 134, 252, 0.2)';
      boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    } else {
      // Normal keys
      background = 'linear-gradient(145deg, #3a3a6a, #2e2e4e)';
      color = '#e8eaed';
      border = '1px solid rgba(187, 134, 252, 0.2)';
      boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    }
    
    return {
      minWidth: key === 'Space' ? '200px' : isSpecialKey ? '60px' : '40px',
      height: '40px',
      margin: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
      fontSize: key === 'Space' ? '0.8rem' : '0.9rem',
      fontWeight: 'bold',
      cursor: 'default',
      fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
      background,
      color,
      border,
      boxShadow,
      transform: isNextKey ? 'scale(1.1)' : isLastTyped ? 'scale(1.05)' : 'scale(1)',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: isNextKey ? 'scale(1.15)' : isLastTyped ? 'scale(1.1)' : 'scale(1.05)',
        boxShadow: isNextKey 
          ? '0 0 25px rgba(3, 218, 198, 0.7), 0 0 50px rgba(187, 134, 252, 0.4)'
          : isLastTyped
            ? '0 0 20px rgba(255, 152, 0, 0.7)'
            : '0 4px 8px rgba(187, 134, 252, 0.3)'
      }
    };
  };

  return (
    <Paper sx={{ 
      p: 3, 
      background: 'linear-gradient(145deg, #0f0f23, #1a1a2e)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(187, 134, 252, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      borderRadius: 3
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 1
      }}>
        {keyboardRows.map((row, rowIndex) => (
          <Box key={rowIndex} sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: 0.5,
            width: '100%'
          }}>
            {row.map((key) => (
              <Box
                key={key}
                sx={getKeyStyles(key)}
              >
                {key === 'Space' ? 'SPACE' : key}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      
      {/* Next character indicator */}
      <Box sx={{ 
        mt: 2, 
        textAlign: 'center',
        color: '#bb86fc',
        fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace"
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 1 }}>
          <Box>
            <Box sx={{ fontSize: '0.8rem', opacity: 0.8 }}>
              Next:
            </Box>
            <Box sx={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              color: '#03dac6',
              textShadow: '0 0 10px rgba(3, 218, 198, 0.5)'
            }}>
              {nextChar === ' ' ? '⎵ (SPACE)' : nextChar === '\n' ? '⏎ (ENTER)' : nextChar || '✓'}
            </Box>
          </Box>
          
          {lastTypedChar && (
            <Box>
              <Box sx={{ fontSize: '0.8rem', opacity: 0.8 }}>
                Last typed:
              </Box>
              <Box sx={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                color: '#ff9800',
                textShadow: '0 0 10px rgba(255, 152, 0, 0.5)'
              }}>
                {lastTypedChar === ' ' ? '⎵' : lastTypedChar === '\n' ? '⏎' : lastTypedChar}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default VirtualKeyboard;