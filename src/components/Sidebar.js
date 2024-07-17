import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import './Sidebar.css';

const Sidebar = ({ open, onClose }) => {
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
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;