import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import PluginAdminLayout from './components/PluginAdminLayout';
import pluginTheme from './theme/pluginTheme'; // Import the custom theme

function App() {
  return (
    <ThemeProvider theme={pluginTheme}>
      <CssBaseline />
      <PluginAdminLayout />
    </ThemeProvider>
  );
}

export default App;