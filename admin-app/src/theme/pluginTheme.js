import { createTheme } from '@mui/material/styles';

const pluginTheme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50', // Dark blue-grey for sidebar
    },
    secondary: {
      main: '#3498db', // A lighter blue for accents or primary actions
    },
    background: {
      default: '#f4f6f8', // Light grey for content background
      paper: '#ffffff', // White for Paper components
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
      disabled: '#aaaaaa',
    },
    sidebar: {
      background: '#2c3e50', // Dark sidebar background
      text: '#ecf0f1', // Light text for sidebar
      hoverBackground: '#34495e',
      activeBackground: '#1a252f',
      activeText: '#ffffff',
    }
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    // Add other typography variants as needed
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // White AppBar
          color: '#333333', // Dark text on AppBar
          boxShadow: '0 2px 4px -1px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2c3e50', // Dark sidebar background from palette
          color: '#ecf0f1', // Light text for sidebar from palette
          borderRight: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#1a252f', // activeBackground from palette
            color: '#ffffff', // activeText from palette
            '&:hover': {
              backgroundColor: '#1a252f', // Keep active background on hover
            },
          },
          '&:hover': {
            backgroundColor: '#34495e', // hoverBackground from palette
          },
          borderRadius: '4px', // Slightly rounded buttons
          margin: '4px 8px', // Add some margin around buttons
          padding: '10px 16px',
        },
      },
    },
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                color: 'inherit', // Inherit color from ListItemText/ListItemButton
                minWidth: '40px',
            }
        }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          // General Paper styling, can be overridden by specific components
        }
      }
    }
  },
});

export default pluginTheme;