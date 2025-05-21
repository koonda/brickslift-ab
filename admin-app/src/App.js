import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom'; // Added NavLink
import { Box, Typography, Container, AppBar, Toolbar, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Pages
import TestListPage from './pages/TestListPage';
import TestEditPage from './pages/TestEditPage';

// Placeholder Dashboard Page
const DashboardPage = () => (
  <Container>
    <Typography variant="h5" sx={{mt:2}}>Dashboard</Typography>
    <Typography>Welcome to the BricksLift A/B Dashboard. Overview and aggregate stats will be shown here.</Typography>
  </Container>
);

const drawerWidth = 240;

function App() {
  console.log('BricksLift A/B: App component rendered with Router.');

  // Define drawerWidth, can be moved to a constants file later
  const drawerWidth = 240;

  // Drawer content remains similar, but will be placed differently
  const drawerContent = (
    <Box>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1, backgroundColor: 'primary.main', color: 'white' }}>
        {/* Placeholder for Logo - to be added */}
        <Typography variant="h6" noWrap component="div">
          BricksLift A/B
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/tests" sx={{ '&.active': { backgroundColor: 'action.selected' } }}>
            <ListItemIcon><ListAltIcon /></ListItemIcon>
            <ListItemText primary="A/B Tests" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/tests/new" sx={{ '&.active': { backgroundColor: 'action.selected' } }}>
            <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
            <ListItemText primary="Create Test" />
          </ListItemButton>
        </ListItem>
        {/* Placeholder for Dashboard link if needed later */}
        {/* <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/dashboard" sx={{ '&.active': { backgroundColor: 'action.selected' } }}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem> */}
      </List>
    </Box>
  );

  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 32px)' /* Adjust for WP admin bar if needed, or let WP handle scroll */ }}>
        <CssBaseline />
        {/* Sidebar Drawer - now part of the normal flow */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              position: 'relative', // No longer fixed, part of page flow
              height: 'auto', // Or '100%' if parent Box has fixed height
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            // width: `calc(100% - ${drawerWidth}px)` // Width is handled by flexGrow
          }}
        >
          {/* No AppBar, so no Toolbar spacer needed here unless for other reasons */}
          {/* Page title can be rendered by each page component or a wrapper */}
          <Routes>
            <Route path="/" element={<Navigate replace to="/tests" />} />
            {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
            <Route path="/tests" element={<TestListPage />} />
            <Route path="/tests/new" element={<TestEditPage />} />
            <Route path="/tests/edit/:testId" element={<TestEditPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;