import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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
const storage = getStorage(app);

// Fonction pour récupérer tous les utilisateurs
export const getUsers = async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return usersList;
};

export { auth, db, storage };
