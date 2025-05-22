import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Tune as TuneIcon,
  Policy as PolicyIcon,
  MoreHoriz as MoreHorizIcon,
  CreditCard as CreditCardIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

const drawerWidth = 280;

const PluginAdminLayout = () => {
  const theme = useTheme();
  const [selectedPage, setSelectedPage] = useState('Dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleNavigationClick = (pageName) => {
    setSelectedPage(pageName);
    if (!pageName.startsWith('Settings/')) {
      setSettingsOpen(false);
    }
  };

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
    // Optionally, select a default settings page or clear selection
    // setSelectedPage('Settings'); // Or null if settings itself is not a page
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, pageId: 'Dashboard' },
    { text: 'A/B Tests', icon: <AnalyticsIcon />, pageId: 'A/B Tests' },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      pageId: 'Settings', // Main settings toggle
      subItems: [
        { text: 'General', icon: <TuneIcon />, pageId: 'Settings/General' },
        { text: 'GDPR', icon: <PolicyIcon />, pageId: 'Settings/GDPR' },
        { text: 'Other', icon: <MoreHorizIcon />, pageId: 'Settings/Other' },
        { text: 'License', icon: <CreditCardIcon />, pageId: 'Settings/License' },
      ],
    },
  ];

  const renderContent = () => {
    switch (selectedPage) {
      case 'Dashboard':
        return <Typography variant="h4">Dashboard Content</Typography>;
      case 'A/B Tests':
        return <Typography variant="h4">A/B Tests Content</Typography>;
      case 'Settings/General':
        return <Typography variant="h4">General Settings Content</Typography>;
      case 'Settings/GDPR':
        return <Typography variant="h4">GDPR Settings Content</Typography>;
      case 'Settings/Other':
        return <Typography variant="h4">Other Settings Content</Typography>;
      case 'Settings/License':
        return <Typography variant="h4">License Settings Content</Typography>;
      default:
        return <Typography variant="h4">Welcome</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            BricksLift A/B - {selectedPage}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.sidebar.background,
            color: theme.palette.sidebar.text,
            borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
          },
        }}
      >
        <Toolbar>
            <Typography variant="h5" sx={{ color: theme.palette.sidebar.text, width: '100%', textAlign: 'center', fontWeight:'bold' }}>
                BricksLift A/B
            </Typography>
        </Toolbar>
        <Box sx={{ overflow: 'auto', p: 1 }}>
          <List component="nav">
            {menuItems.map((item) =>
              item.subItems ? (
                <React.Fragment key={item.text}>
                  <ListItemButton
                    onClick={handleSettingsClick}
                    selected={selectedPage.startsWith('Settings/') || settingsOpen}
                    sx={{
                        '&.Mui-selected': {
                            backgroundColor: theme.palette.sidebar.activeBackground,
                            color: theme.palette.sidebar.activeText,
                            '& .MuiListItemIcon-root': {
                                color: theme.palette.sidebar.activeText,
                            },
                        },
                        '&:hover': {
                            backgroundColor: theme.palette.sidebar.hoverBackground,
                        },
                        color: theme.palette.sidebar.text,
                    }}
                  >
                    <ListItemIcon sx={{color: 'inherit'}}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {settingsOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2 }}>
                      {item.subItems.map((subItem) => (
                        <ListItemButton
                          key={subItem.text}
                          selected={selectedPage === subItem.pageId}
                          onClick={() => handleNavigationClick(subItem.pageId)}
                          sx={{
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.sidebar.activeBackground,
                                color: theme.palette.sidebar.activeText,
                                '& .MuiListItemIcon-root': {
                                    color: theme.palette.sidebar.activeText,
                                },
                            },
                            '&:hover': {
                                backgroundColor: theme.palette.sidebar.hoverBackground,
                            },
                            color: theme.palette.sidebar.text,
                          }}
                        >
                          <ListItemIcon sx={{color: 'inherit'}}>{subItem.icon}</ListItemIcon>
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              ) : (
                <ListItemButton
                  key={item.text}
                  selected={selectedPage === item.pageId}
                  onClick={() => handleNavigationClick(item.pageId)}
                  sx={{
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.sidebar.activeBackground,
                        color: theme.palette.sidebar.activeText,
                        '& .MuiListItemIcon-root': {
                            color: theme.palette.sidebar.activeText,
                        },
                    },
                    '&:hover': {
                        backgroundColor: theme.palette.sidebar.hoverBackground,
                    },
                    color: theme.palette.sidebar.text,
                  }}
                >
                  <ListItemIcon sx={{color: 'inherit'}}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              )
            )}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar /> {/* For spacing below the AppBar */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: theme.shape.borderRadius,
            minHeight: 'calc(100vh - 64px - 48px)', // Adjust based on AppBar and padding
          }}
        >
          {renderContent()}
        </Paper>
      </Box>
    </Box>
  );
};

export default PluginAdminLayout;