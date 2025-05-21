import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles'; // More direct import for GlobalStyles
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

// Custom global styles to ensure MUI inputs are not overridden by WP admin styles
const globalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      '#blft-ab-admin-app .MuiInputBase-root': { // Target MuiInputBase within our app
        // Overriding WP's default input height/padding if necessary
        // Example: Adjust padding or height if WP styles are too aggressive
        // padding: '8.5px 14px', // Example, adjust as needed
        // boxSizing: 'border-box', // Ensure box-sizing is consistent
      },
      '#blft-ab-admin-app .MuiInputBase-input': {
        // height: 'auto', // Allow MUI to control height
        // padding: '8.5px 14px', // Match MuiInputBase-root or theme defaults
      },
      '#blft-ab-admin-app .MuiOutlinedInput-root': { // More specific for outlined variant
        // Add any specific overrides for outlined inputs if needed
      },
      '#blft-ab-admin-app .MuiTextField-root .MuiInputLabel-outlined': {
         // Fix for label position if it's off with size="small"
         // transform: 'translate(14px, 10px) scale(1)', // Adjust for size="small"
      },
      '#blft-ab-admin-app .MuiTextField-root .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        // transform: 'translate(14px, -9px) scale(0.75)', // Adjust for shrink with size="small"
      },
       // Ensure selects also look consistent
      '#blft-ab-admin-app .MuiSelect-select': {
        // padding: '8.5px 14px', // Example for consistency
      }
    })}
  />
);

// A simple MUI theme for now
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const rootElement = document.getElementById('blft-ab-admin-app');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles} {/* Add global styles */}
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
  console.log('BricksLift A/B: React admin app initialized.');
} else {
  console.error('BricksLift A/B: Root element #blft-ab-admin-app not found.');
}