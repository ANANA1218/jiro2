import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDt7yqJ8zqkZ2lWIHSB8Gun4byRUqGYs6s",
  authDomain: "jiro-ikram-annabelle.firebaseapp.com",
  projectId: "jiro-ikram-annabelle",
  storageBucket: "jiro-ikram-annabelle.appspot.com",
  messagingSenderId: "1006974861342",
  appId: "1:1006974861342:web:a2627312ed2e450fb9ee0f"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Utilisez l'application existante
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
