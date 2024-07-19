// src/tests/integration.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ThemeProvider, ThemeContext } from '../ThemeContext';
import Navbar from '../components/Navbar';
import Profile from '../components/Profile';
import Settings from '../components/Settings';

jest.mock('firebase/auth');

const mockAuth = {
  currentUser: { email: 'test@example.com', uid: '123' },
};
getAuth.mockReturnValue(mockAuth);

describe('Integration and Application Logic', () => {
  const renderWithProviders = (ui, { theme = {}, user = null, route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <ThemeProvider>
        <ThemeContext.Provider value={{ theme, setTheme: jest.fn() }}>
          <Router>
            <Routes>
              <Route path="/" element={<Navbar />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={ui} />
            </Routes>
          </Router>
        </ThemeContext.Provider>
      </ThemeProvider>
    );
  };

  test('User state changes correctly on login and logout', async () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockAuth.currentUser);
    });

    renderWithProviders(<Profile />, { route: '/profile' });

    expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();

    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
    });

    renderWithProviders(<Profile />, { route: '/profile' });

    expect(screen.queryByText('Welcome, test@example.com')).not.toBeInTheDocument();
  });

  test('Protected pages redirect to login if not authenticated', async () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
    });

    renderWithProviders(<Profile />, { route: '/profile' });

    expect(screen.queryByText('Welcome, test@example.com')).not.toBeInTheDocument();
    // Assuming you have a <Redirect /> component or similar to handle redirects
    // You would check for the presence of the login page elements here
  });

  test('Theme changes correctly when a new theme is selected', async () => {
    const setTheme = jest.fn();
    renderWithProviders(<Settings />, { theme: { navbarColor: '#f8f9fa' }, setTheme });

    fireEvent.click(screen.getByText('Theme 1'));

    expect(setTheme).toHaveBeenCalledWith({
      backgroundImage: 'url(/images/image1.jpg)',
      navbarColor: '#f8f9fa',
    });

    fireEvent.click(screen.getByText('Theme 2'));

    expect(setTheme).toHaveBeenCalledWith({
      backgroundImage: 'url(/images/image2.png)',
      navbarColor: '#0038ff',
    });
  });

  test('Navbar color changes based on selected theme', async () => {
    const setTheme = jest.fn();
    const theme = { navbarColor: '#007bff' };

    renderWithProviders(<Navbar />, { theme, setTheme });

    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveStyle('background-color: #007bff');
  });
});
