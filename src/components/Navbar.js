import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import Sidebar
import logo from '../assets/Logo Pastel transparent.png'; // Import the logo
import './Navbar.css';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <AppBar position="static" className="navbar">
        <Toolbar className="toolbar">
          <img src={logo} alt="JIRO Logo" className="navbar-logo" />
          <div className="navbar-links">
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Signup</Button>
          </div>
          <IconButton edge="end" color="inherit" onClick={handleSidebarOpen}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
    </>
  );
};

export default Navbar;
