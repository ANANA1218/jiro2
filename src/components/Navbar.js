import React, { useState, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import Sidebar
import './Navbar.css';
import logo from '../assets/logoblue.png'; // Import the logo image
import { ThemeContext } from './ThemeContext';
import { auth, db } from './Firebase'; // Chemin relatif à votre fichier firebase.js


const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <AppBar position="static" className="navbar" style={{ backgroundColor: theme.navbarColor }}>
        <Toolbar className="navbar-toolbar">
          <div className="navbar-logo">
            <img src={logo} alt="JIRO Logo" className="navbar-logo-img"/>
          </div>
          <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            <IconButton edge="end" color="inherit" onClick={handleSidebarOpen} className="sidebar-button">
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
    </>
  );
};

export default Navbar;
