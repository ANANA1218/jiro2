
import { Drawer, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { useHistory } from 'react-router-dom'; // For navigation
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './Firebase';
import { Link } from 'react-router-dom'; // Assurez-vous que React Router est installé et configuré

const Sidebar = ({ open, onClose }) => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
              const email = user.email;
              setUserEmail(email);
          } else {
              setUserEmail(null); // L'utilisateur n'est pas connecté
          }
      });

      return () => unsubscribe();
  }, []);


  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="sidebar">
      <h2>Welcome, {userEmail}</h2>
            <Link to="/new-board">
                <button>Create New Board</button>
            </Link>

      </div>
    </Drawer>
  );
};

export default Sidebar;