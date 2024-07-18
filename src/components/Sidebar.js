// Sidebar.js
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

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="sidebar">
        <List>
          <ListItem>
            <ListItemText primary="User Profile" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Settings" />
          </ListItem>
          <Divider />
          <ListItem>
            <Button onClick={handleLogout} variant="contained" className="logout-button" fullWidth>
              Logout
            </Button>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
