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

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          BricksLift A/B
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {/* Dashboard Link Example - if re-enabled */}
        {/* <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/">
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem> */}
        <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/tests">
            <ListItemIcon><ListAltIcon /></ListItemIcon>
            <ListItemText primary="A/B Tests" />
          </ListItemButton>
        </ListItem>
         <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/tests/new">
            <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
            <ListItemText primary="Create Test" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  
  // Removed RouterNavLink component

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              A/B Testing Dashboard
              {/* This could be dynamic based on route */}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar /> {/* Spacer for AppBar */}
          <Routes>
            <Route path="/" element={<Navigate replace to="/tests" />} />
            {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
            <Route path="/tests" element={<TestListPage />} />
            <Route path="/tests/new" element={<TestEditPage />} />
            <Route path="/tests/edit/:testId" element={<TestEditPage />} />
            {/* Add other routes here */}
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;