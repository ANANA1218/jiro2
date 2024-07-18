import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ResetPassword from './components/Auth/Resetpassword';
import NewBoard from './components/NewBoard';
import Home from './components/Home';
import TrelloBoard from './components/Board';
import Profile from './components/Auth/Profile';
import Settings from './components/Settings';
import { CssBaseline, Container } from '@mui/material';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './components/Firebase';
import { ThemeProvider, ThemeContext } from './components/ThemeContext'; // Assurez-vous que cela est correctement importé

function App() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
            setUser(userAuth);
            setInitializing(false);
        });

        return () => unsubscribe();
    }, []);

    if (initializing) {
        return <div>Loading...</div>;
    }

    return (
        <ThemeProvider>
            <Router>
                <CssBaseline />
                <div className="App">
                    <Navbar />
                    <Container maxWidth="lg" style={{ paddingTop: '2rem' }}>
                        <Routes>
                            <Route path="/" element={user ? <Navigate to="/profile" /> : <Home />} />
                            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                            <Route path="/trello-board/:boardId" element={user ? <TrelloBoard /> : <Navigate to="/login" />} />
                            <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login />} />
                            <Route path="/signup" element={user ? <Navigate to="/profile" /> : <Signup />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/new-board" element={user ? <NewBoard /> : <Navigate to="/login" />} />
                            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
                        </Routes>
                    </Container>
                    <Footer />
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
