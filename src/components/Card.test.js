import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';
import { ThemeProvider, ThemeContext } from '../ThemeContext';
import { getAuth } from 'firebase/auth';

jest.mock('firebase/auth');

describe('Card component', () => {
  const mockAuth = {
    currentUser: { email: 'test@example.com' }
  };
  getAuth.mockReturnValue(mockAuth);

  const card = {
    id: '1',
    title: 'Test Card',
    description: 'This is a test card',
    priority: 'High',
    assignedTo: 'test@example.com',
    picture: 'test-picture-url'
  };

  const renderWithTheme = (props) => {
    return render(
      <ThemeProvider>
        <ThemeContext.Provider value={{ theme: { navbarColor: '#f8f9fa' } }}>
          <Card {...props} />
        </ThemeContext.Provider>
      </ThemeProvider>
    );
  };

  test('renders Card with correct fields', () => {
    renderWithTheme({ card, laneId: 'lane-1', onUpdateCard: jest.fn(), onDeleteCard: jest.fn(), onDragStart: jest.fn() });

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a test card')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Assigned to: test@example.com')).toBeInTheDocument();
    expect(screen.getByAltText('Card')).toBeInTheDocument();
  });

  test('allows editing the card', () => {
    const onUpdateCard = jest.fn();
    renderWithTheme({ card, laneId: 'lane-1', onUpdateCard, onDeleteCard: jest.fn(), onDragStart: jest.fn() });

    fireEvent.click(screen.getByRole('button', { name: /pencil-alt/i }));

    fireEvent.change(screen.getByDisplayValue('Test Card'), { target: { value: 'Updated Test Card' } });
    fireEvent.change(screen.getByDisplayValue('This is a test card'), { target: { value: 'Updated description' } });
    fireEvent.change(screen.getByDisplayValue('High'), { target: { value: 'Medium' } });
    fireEvent.change(screen.getByDisplayValue('test@example.com'), { target: { value: 'updated@example.com' } });

    fireEvent.click(screen.getByText('Save'));

    expect(onUpdateCard).toHaveBeenCalledWith('lane-1', '1', 'Updated Test Card', 'Updated description', 'Medium', 'updated@example.com', 'test-picture-url');
  });

  test('calls onDeleteCard when delete button is clicked', () => {
    const onDeleteCard = jest.fn();
    renderWithTheme({ card, laneId: 'lane-1', onUpdateCard: jest.fn(), onDeleteCard, onDragStart: jest.fn() });

    fireEvent.click(screen.getByRole('button', { name: /trash/i }));

    expect(onDeleteCard).toHaveBeenCalledWith('lane-1', '1');
  });

  test('expands and collapses the image on click', () => {
    renderWithTheme({ card, laneId: 'lane-1', onUpdateCard: jest.fn(), onDeleteCard: jest.fn(), onDragStart: jest.fn() });

    const cardImage = screen.getByAltText('Card');
    fireEvent.click(cardImage);

    const expandedImage = screen.getByAltText('Expanded Card');
    expect(expandedImage).toBeInTheDocument();

    fireEvent.click(expandedImage);
    expect(expandedImage).not.toBeInTheDocument();
  });
});
