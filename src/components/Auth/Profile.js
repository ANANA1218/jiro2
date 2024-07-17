import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../Firebase'; // Assurez-vous d'importer db depuis votre configuration Firebase
import { Link } from 'react-router-dom';

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
                    const boardsSnapshot = await db.collection('boards').where('createdBy', 'array-contains', userAuth.uid).get();
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
        return <div>Loading...</div>; // Afficher un message de chargement tant que l'authentification est en cours
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
                        <Link to={`/boards/${board.id}`}>{board.name}</Link>
                    </li>
                ))}
            </ul>

            <Link to="/edit-profile">
                <button>Edit Profile</button>
            </Link>
        </section>
    );
}

export default Profile;
