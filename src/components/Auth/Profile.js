import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../Firebase';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { FaTrash } from 'react-icons/fa';
import './profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userBoards, setUserBoards] = useState([]);
    const [boardName, setBoardName] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) {
                setUser(userAuth);
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
                setUser(null);
                setUserBoards([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleDeleteBoard = async (boardId) => {
        try {
            await deleteDoc(doc(db, 'boards', boardId));
            setUserBoards(userBoards.filter(board => board.id !== boardId));
            console.log(`Board ${boardId} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting board:', error);
        }
    };

    const handleCreateBoard = async () => {
        if (boardName.trim() === '') {
            alert('Board name cannot be empty!');
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "boards"), {
                name: boardName,
                createdBy: auth.currentUser.uid,
                createdAt: serverTimestamp(),
            });

            await addDoc(collection(db, `boards/${docRef.id}/lanes`), {
                title: 'Default Lane',
                cards: []
            });

            console.log("Board created with ID: ", docRef.id);
            setUserBoards([...userBoards, { id: docRef.id, name: boardName, createdBy: auth.currentUser.uid }]);
            setBoardName('');
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    const pastelColors = ['#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#D0BAFF', '#B4E5FA', '#E4D0F0'];

    return (
        <div className="profile-container">
            <div className="profile-header">
                {user.photoURL && <img src={user.photoURL} alt="Profile" />}
                <h2>Welcome to  you JIRO </h2>
                <p>Email: {user.email}</p>
            </div>

            <div className="board-creation">
                <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder="Enter board name"
                />
                <button onClick={handleCreateBoard}>Create Board</button>
            </div>

            <h3>Boards:</h3>
            <ul className="boards-list">
                {userBoards.map((board, index) => (
                    <li key={board.id} style={{ backgroundColor: pastelColors[index % pastelColors.length] }}>
                        <Link to={`/trello-board/${board.id}`}>{board.name}</Link>
                        <button onClick={() => handleDeleteBoard(board.id)}>
                            <FaTrash />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Profile;
