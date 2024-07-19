import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Settings from './Settings';
import { ThemeProvider, ThemeContext } from '../ThemeContext';

describe('Settings component', () => {
  const renderWithTheme = (theme, setTheme) => {
    return render(
      <ThemeProvider>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <Settings />
        </ThemeContext.Provider>
      </ThemeProvider>
    );
  };

  test('renders Settings with correct theme options', () => {
    const theme = { navbarColor: '#f8f9fa' };
    const setTheme = jest.fn();

    renderWithTheme(theme, setTheme);

    expect(screen.getByText('Theme 1')).toBeInTheDocument();
    expect(screen.getByText('Theme 2')).toBeInTheDocument();
    expect(screen.getByText('Theme 3')).toBeInTheDocument();
    expect(screen.getByText('Theme 4')).toBeInTheDocument();
    expect(screen.getByText('Theme 5')).toBeInTheDocument();
  });

  test('changes theme when an option is clicked', () => {
    const theme = { navbarColor: '#f8f9fa' };
    const setTheme = jest.fn();

    renderWithTheme(theme, setTheme);

    fireEvent.click(screen.getByText('Theme 1'));
    expect(setTheme).toHaveBeenCalledWith({
      backgroundImage: 'url(/images/image1.jpg)',
      navbarColor: '#f8f9fa'
    });

    fireEvent.click(screen.getByText('Theme 2'));
    expect(setTheme).toHaveBeenCalledWith({
      backgroundImage: 'url(/images/image2.png)',
      navbarColor: '#0038ff'
    });

    fireEvent.click(screen.getByText('Theme 3'));
    expect(setTheme).toHaveBeenCalledWith({
      backgroundImage: 'url(/images/image3.png)',
      navbarColor: '#007bff'
    });

    fireEvent.click(screen.getByText('Theme 4'));
    expect(setTheme).toHaveBeenCalledWith({
      backgroundImage: 'url(/images/image4.png)',
      navbarColor: '#6c757d'
    });

    fireEvent.click(screen.getByText('Theme 5'));
    expect(setTheme).toHaveBeenCalledWith({
      backgroundImage: 'url(/images/image5.png)',
      navbarColor: '#28a745'
    });
  });
});
