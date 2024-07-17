import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from './Firebase';

const NewBoard = () => {
    const [boardName, setBoardName] = useState('');
    const navigate = useNavigate();

    const handleCreateBoard = async () => {
        try {
            const docRef = await addDoc(collection(db, "boards"), {
                name: boardName,
                createdBy: auth.currentUser.uid,
                createdAt: serverTimestamp(),
            });

            // Create a default lane for the new board
            await addDoc(collection(db, `boards/${docRef.id}/lanes`), {
                title: 'Default Lane',
                cards: []
            });

            console.log("Board created with ID: ", docRef.id);

            // Redirect to the board page after creating the board
            navigate(`/trello-board/${docRef.id}`);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

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
