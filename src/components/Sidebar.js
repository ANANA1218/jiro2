import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { auth } from './Firebase';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleUserProfile = () => {
    navigate('/profile');
    onClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="sidebar">
        <List>
          <ListItem button onClick={handleUserProfile}>
            <ListItemText primary="User Profile" />
          </ListItem>
          <Divider />
          <ListItem button onClick={handleSettings}>
            <ListItemText primary="Settings" />
          </ListItem>
          <Divider />
          <ListItem>
            <Button onClick={handleLogout} variant="contained" color="secondary" fullWidth>
              Logout
            </Button>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
