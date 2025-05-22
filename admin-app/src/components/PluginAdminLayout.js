import React, { useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Tabs,
  Tab,
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
} from '@mui/icons-material';
import TestListPage from '../pages/TestListPage';
import TestEditPage from '../pages/TestEditPage';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`plugin-tabpanel-${index}`}
      aria-labelledby={`plugin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const PluginAdminLayout = () => {
  const theme = useTheme();
  const [primaryTab, setPrimaryTab] = useState(0);
  const [selectedSettingsPage, setSelectedSettingsPage] = useState('General');
  const [abTestSubPage, setAbTestSubPage] = useState('list'); // 'list' or 'create'

  const handlePrimaryTabChange = (event, newValue) => {
    setPrimaryTab(newValue);
    // Reset to list view when switching to A/B Tests tab
    if (newValue === 1) {
      setAbTestSubPage('list');
    }
  };

  const handleSettingsNavigationClick = (pageName) => {
    setSelectedSettingsPage(pageName);
  };

  const handleNavigateToCreateTest = () => {
    setAbTestSubPage('create');
  };

  const handleNavigateToTestList = () => {
    setAbTestSubPage('list');
  };

  const settingsMenuItems = [
    { text: 'General', icon: <TuneIcon />, pageId: 'General' },
    { text: 'GDPR', icon: <PolicyIcon />, pageId: 'GDPR' },
    { text: 'Other', icon: <MoreHorizIcon />, pageId: 'Other' },
    { text: 'License', icon: <CreditCardIcon />, pageId: 'License' },
  ];

  const renderSettingsContent = () => {
    switch (selectedSettingsPage) {
      case 'General':
        return <Typography variant="h5">General Settings Content</Typography>;
      case 'GDPR':
        return <Typography variant="h5">GDPR Settings Content</Typography>;
      case 'Other':
        return <Typography variant="h5">Other Settings Content</Typography>;
      case 'License':
        return <Typography variant="h5">License Settings Content</Typography>;
      default:
        return <Typography variant="h5">Select a setting</Typography>;
    }
  };

  return (
    <Paper elevation={3} sx={{ 
        borderRadius: theme.shape.borderRadius, 
        m: 2, // Margin to ensure it's contained
        overflow: 'hidden' // Ensures children adhere to border radius
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={primaryTab} 
          onChange={handlePrimaryTabChange} 
          aria-label="Plugin primary navigation tabs"
          indicatorColor="secondary"
          textColor="inherit"
          sx={{
            '& .MuiTab-root': {
              color: theme.palette.text.secondary, // Use theme for text color
              '&.Mui-selected': {
                color: theme.palette.secondary.main, // Use theme for selected text color
              },
            },
            backgroundColor: theme.palette.background.paper, // Ensure tabs background matches paper
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
          }}
        >
          <Tab label="Dashboard" icon={<DashboardIcon />} iconPosition="start" id="plugin-tab-0" aria-controls="plugin-tabpanel-0" />
          <Tab label="A/B Tests" icon={<AnalyticsIcon />} iconPosition="start" id="plugin-tab-1" aria-controls="plugin-tabpanel-1" />
          <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" id="plugin-tab-2" aria-controls="plugin-tabpanel-2" />
        </Tabs>
      </Box>

      <TabPanel value={primaryTab} index={0}>
        <Typography variant="h4">Dashboard Content</Typography>
        <Typography>This is where the main dashboard overview will be displayed.</Typography>
      </TabPanel>
      <TabPanel value={primaryTab} index={1}>
        {abTestSubPage === 'list' && (
          <TestListPage onCreateNewTestClick={handleNavigateToCreateTest} />
        )}
        {abTestSubPage === 'create' && (
          <TestEditPage onCancel={handleNavigateToTestList} />
        )}
      </TabPanel>
      <TabPanel value={primaryTab} index={2}>
        <Typography variant="h4" gutterBottom>Settings</Typography>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ 
            width: '240px', 
            flexShrink: 0, 
            borderRight: 1, 
            borderColor: 'divider',
            mr: 2,
            backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900], // Subtle background for settings nav
            borderRadius: theme.shape.borderRadius,
            p:1
          }}>
            <List component="nav" dense>
              {settingsMenuItems.map((item) => (
                <ListItemButton
                  key={item.text}
                  selected={selectedSettingsPage === item.pageId}
                  onClick={() => handleSettingsNavigationClick(item.pageId)}
                  sx={{ // Using styles from pluginTheme for consistency
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.sidebar?.activeBackground || theme.palette.action.selected,
                      color: theme.palette.sidebar?.activeText || theme.palette.text.primary,
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.sidebar?.activeText || theme.palette.text.primary,
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.sidebar?.activeBackground || theme.palette.action.selected,
                      }
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.sidebar?.hoverBackground || theme.palette.action.hover,
                    },
                    color: theme.palette.sidebar?.text || theme.palette.text.secondary,
                    borderRadius: '4px',
                    margin: '4px 0px', // Adjusted margin
                    padding: '8px 12px', // Adjusted padding
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: '36px' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Box>
          <Box sx={{ flexGrow: 1, pl: 2 }}>
            {renderSettingsContent()}
          </Box>
        </Box>
      </TabPanel>
    </Paper>
  );
};

export default PluginAdminLayout;