import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../Firebase'; // Assurez-vous d'importer db depuis votre configuration Firebase
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from "firebase/firestore"; // Import Firestore methods

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userBoards, setUserBoards] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) {
                // Utilisateur connecté
                setUser(userAuth);

                // Récupérer les boards de l'utilisateur
                try {
                    const boardsCollection = collection(db, 'boards');
                    const q = query(boardsCollection, where('createdBy', '==', userAuth.uid));
                    const boardsSnapshot = await getDocs(q);
                    const userBoardsData = boardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setUserBoards(userBoardsData);
                } catch (error) {
                    console.error('Error fetching user boards:', error);
                }
            } else {
                // Utilisateur non connecté
                setUser(null);
                setUserBoards([]);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!user) {
        return <div>Loading...</div>; 
    }

    return (
        <section>
            <h2>Welcome, {user.displayName || user.email}</h2>
            {user.photoURL && <img src={user.photoURL} alt="Profile" style={{ width: 100, borderRadius: '50%' }} />}
            <p>Email: {user.email}</p>

            <h3>Boards:</h3>
            <ul>
                {userBoards.map(board => (
                    <li key={board.id}>
                        <Link to={`/trello-board/${board.id}`}>{board.name}</Link>
                    </li>
                ))}
            </ul>

            
        </section>
    );
}

export default Profile;
