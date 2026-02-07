
// src/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul educativo
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', // Estilo más moderno y menos rígido
          fontWeight: 600,
        },
      },
    },
  },
});