import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/login');
  };

  const handleUserProfile = () => {
    navigate('/profile'); // Navigate to user profile page
    onClose(); // Close the sidebar after navigation
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="sidebar">
        <List>
          <ListItem button onClick={handleUserProfile}>
            <ListItemText primary="User Profile" />
          </ListItem>
          <Divider />
          <ListItem button>
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
