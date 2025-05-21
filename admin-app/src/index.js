import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App'; // Assuming a basic App.js will be created next

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
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
  console.log('BricksLift A/B: React admin app initialized.');
} else {
  console.error('BricksLift A/B: Root element #blft-ab-admin-app not found.');
}