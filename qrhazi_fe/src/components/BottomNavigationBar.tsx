import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import QrIcon from '@mui/icons-material/QrCode';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import Paper from '@mui/material/Paper';
import React from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export function BottomNavigationBar(props: any) {
  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        value={props.navigationValue}
        onChange={props.handleNavigationChange}
      >
        <BottomNavigationAction
          icon={<QrIcon sx={{ fontSize: 35 }} />}
          label='QR access'
          value='qr_access'
        />
        <BottomNavigationAction
          icon={<ProfileIcon sx={{ fontSize: 35 }} />}
          label='Profile'
          value='profile'
        />
        {props.isAdmin ? (
          <BottomNavigationAction
            icon={<AdminPanelSettingsIcon sx={{ fontSize: 35 }} />}
            label='Admin'
            value='admin'
          />
        ) : null}
      </BottomNavigation>
    </Paper>
  );
}
