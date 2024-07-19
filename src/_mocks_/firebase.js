export const initializeApp = jest.fn();
export const getApps = jest.fn(() => []);
export const getApp = jest.fn();
export const getAuth = jest.fn(() => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));
export const getFirestore = jest.fn(() => ({
  collection: jest.fn(() => ({
    add: jest.fn(),
  })),
}));
