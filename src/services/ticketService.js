// src/services/ticketService.js

import { getFirestore, collection, addDoc } from 'firebase/firestore';

const db = getFirestore();

export const createTicket = async (ticketData) => {
  try {
    const docRef = await addDoc(collection(db, 'tickets'), ticketData);
    return docRef.id;
  } catch (error) {
    throw new Error('Error creating ticket: ' + error.message);
  }
};
