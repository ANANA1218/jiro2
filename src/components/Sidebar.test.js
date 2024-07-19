import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { ThemeProvider, ThemeContext } from '../ThemeContext';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');

describe('Sidebar component', () => {
  const renderWithTheme = (theme, props) => {
    return render(
      <ThemeProvider>
        <ThemeContext.Provider value={{ theme }}>
          <Router>
            <Sidebar {...props} />
          </Router>
        </ThemeContext.Provider>
      </ThemeProvider>
    );
  };

  test('renders Sidebar with correct links', () => {
    renderWithTheme({ navbarColor: '#f8f9fa' }, { open: true, onClose: jest.fn() });

    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const onCloseMock = jest.fn();
    renderWithTheme({ navbarColor: '#f8f9fa' }, { open: true, onClose: onCloseMock });

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
