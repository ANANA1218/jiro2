import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from './Firebase'; // Importez 'auth' depuis votre fichier Firebase

const NewBoard = () => {
    const [boardName, setBoardName] = useState('');

    const navigate = useNavigate();

    const handleCreateBoard = async () => {
        try {
            // Ajout du tableau à Firestore
            const docRef = await addDoc(collection(db, "boards"), {
                name: boardName,
                createdBy: auth.currentUser.uid,
                createdAt: new Date(),
            });
            console.log("Board created with ID: ", docRef.id);
            
            // Redirection vers la page d'accueil après la création du tableau
            navigate('/');
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    return (
        <div>
            <h2>Create a New Board</h2>
            <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="Enter board name"
            />
            <button onClick={handleCreateBoard}>Create Board</button>
        </div>
    );
}
 
export default NewBoard;
