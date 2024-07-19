// src/services/ticketService.test.js

import { createTicket } from './ticketService';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

jest.mock('firebase/firestore');

describe('Ticket Service', () => {
  const mockTicketData = {
    title: 'Test Ticket',
    description: 'This is a test ticket',
    priority: 'High',
    assignedTo: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createTicket creates a ticket with correct data', async () => {
    const mockDocRef = { id: '123' };
    addDoc.mockResolvedValue(mockDocRef);

    const result = await createTicket(mockTicketData);

    expect(addDoc).toHaveBeenCalledWith(collection(getFirestore(), 'tickets'), mockTicketData);
    expect(result).toBe(mockDocRef.id);
  });

  test('createTicket handles errors correctly', async () => {
    const errorMessage = 'Error creating ticket';
    addDoc.mockRejectedValue(new Error(errorMessage));

    await expect(createTicket(mockTicketData)).rejects.toThrow('Error creating ticket: ' + errorMessage);
  });
});
