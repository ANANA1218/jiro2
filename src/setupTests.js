import 'jest-localstorage-mock';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { auth, db } from './Firebase'; // Chemin relatif à votre fichier firebase.js

// Ajouter le polyfill pour TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Firebase
jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
