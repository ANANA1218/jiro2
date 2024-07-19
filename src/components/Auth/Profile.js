import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../Firebase';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import './profile.css'; // Assurez-vous que le chemin est correct

const Profile = () => {
    // State pour stocker les informations de l'utilisateur connecté
    const [user, setUser] = useState(null);
    // State pour stocker les tableaux de l'utilisateur
    const [userBoards, setUserBoards] = useState([]);
    // State pour stocker le nom du nouveau tableau à créer
    const [boardName, setBoardName] = useState('');

    // Utilisation de useEffect pour surveiller l'état de l'authentification de l'utilisateur
    useEffect(() => {
        // Écoute les changements de l'état de l'authentification de l'utilisateur
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) {
                // Si l'utilisateur est connecté, met à jour le state de l'utilisateur
                setUser(userAuth);
                try {
                    // Récupère les tableaux créés par l'utilisateur à partir de Firestore
                    const boardsCollection = collection(db, 'boards');
                    const q = query(boardsCollection, where('createdBy', '==', userAuth.uid));
                    const boardsSnapshot = await getDocs(q);
                    const userBoardsData = boardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    // Met à jour le state des tableaux de l'utilisateur
                    setUserBoards(userBoardsData);
                } catch (error) {
                    console.error('Error fetching user boards:', error);
                }
            } else {
                // Si l'utilisateur n'est pas connecté, réinitialise les states
                setUser(null);
                setUserBoards([]);
            }
        });

        // Nettoyage de l'écouteur lors du démontage du composant
        return () => unsubscribe();
    }, []);

    // Fonction pour gérer la suppression d'un tableau
    const handleDeleteBoard = async (boardId) => {
        try {
            // Supprime le document du tableau à partir de Firestore
            await deleteDoc(doc(db, 'boards', boardId));
            // Met à jour le state des tableaux de l'utilisateur après la suppression
            setUserBoards(userBoards.filter(board => board.id !== boardId));
            console.log(`Board ${boardId} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting board:', error);
        }
    };

    // Fonction pour gérer la création d'un nouveau tableau
    const handleCreateBoard = async () => {
        if (boardName.trim() === '') {
            // Alerte si le nom du tableau est vide
            alert('Board name cannot be empty!');
            return;
        }

        try {
            // Ajoute un nouveau document dans la collection "boards" de Firestore
            const docRef = await addDoc(collection(db, "boards"), {
                name: boardName,
                createdBy: auth.currentUser.uid,
                createdAt: serverTimestamp(),
            });

            // Ajoute un "lane" par défaut dans le nouveau tableau créé
            await addDoc(collection(db, `boards/${docRef.id}/lanes`), {
                title: 'Default Lane',
                cards: []
            });

            console.log("Board created with ID: ", docRef.id);
            // Met à jour le state des tableaux de l'utilisateur avec le nouveau tableau créé
            setUserBoards([...userBoards, { id: docRef.id, name: boardName, createdBy: auth.currentUser.uid }]);
            // Réinitialise le champ de saisie du nom du tableau
            setBoardName('');
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    // Affiche un message de chargement si l'utilisateur n'est pas encore chargé
    if (!user) {
        return <div>Loading...</div>;
    }

    // Rendu du composant Profile
    return (
        <div className="profile-container">
            <div className="profile-header">
                {/* Affiche la photo de profil de l'utilisateur si disponible */}
                {user.photoURL && <img src={user.photoURL} alt="Profile" />}
                <h2>Welcome, {user.displayName || user.email}</h2>
                <p>Email: {user.email}</p>
            </div>

            <div className="board-creation">
                {/* Champ de saisie pour le nom du nouveau tableau */}
                <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder="Enter board name"
                />
                {/* Bouton pour créer un nouveau tableau */}
                <button onClick={handleCreateBoard}>Create Board</button>
            </div>

            <h3>Boards:</h3>
            {/* Liste des tableaux de l'utilisateur */}
            <ul className="boards-list">
                {userBoards.map(board => (
                    <li key={board.id}>
                        <Link to={`/trello-board/${board.id}`}>{board.name}</Link>
                        {/* Bouton pour supprimer un tableau */}
                        <button onClick={() => handleDeleteBoard(board.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Profile;
