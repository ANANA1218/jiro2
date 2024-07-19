// src/services/authService.test.js

import { login, signup } from './authService';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

jest.mock('firebase/auth');

describe('Auth Service', () => {
  const mockUserCredential = { user: { email: 'test@example.com' } };
  const email = 'test@example.com';
  const password = 'password';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login works correctly', async () => {
    signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

    const result = await login(email, password);

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), email, password);
    expect(result).toBe(mockUserCredential.user);
  });

  test('login handles errors correctly', async () => {
    const errorMessage = 'Error logging in';
    signInWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

    await expect(login(email, password)).rejects.toThrow('Error logging in: ' + errorMessage);
  });

  test('signup works correctly', async () => {
    createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);

    const result = await signup(email, password);

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), email, password);
    expect(result).toBe(mockUserCredential.user);
  });

  test('signup handles errors correctly', async () => {
    const errorMessage = 'Error signing up';
    createUserWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

    await expect(signup(email, password)).rejects.toThrow('Error signing up: ' + errorMessage);
  });
});
