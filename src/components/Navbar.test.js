import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import { auth, db } from './Firebase'; // Chemin relatif à votre fichier firebase.js


jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');

describe('Navbar component', () => {
  const renderWithTheme = (theme) => {
    return render(
      <ThemeProvider>
        <ThemeContext.Provider value={{ theme }}>
          <Navbar />
        </ThemeContext.Provider>
      </ThemeProvider>
    );
  };

  test('renders Navbar with correct links', () => {
    renderWithTheme({ navbarColor: '#f8f9fa' });

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  test('changes color based on theme', () => {
    const { container, rerender } = renderWithTheme({ navbarColor: '#f8f9fa' });
    const navbar = container.querySelector('.navbar');
    expect(navbar).toHaveStyle('background-color: #f8f9fa'); // Default theme color

    rerender(
      <ThemeContext.Provider value={{ theme: { navbarColor: '#007bff' } }}>
        <Navbar />
      </ThemeContext.Provider>
    );
    expect(navbar).toHaveStyle('background-color: #007bff'); // New theme color
  });
});
