import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from './Firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc,getDoc } from 'firebase/firestore';
import Lane from './Column';

const TrelloBoard = () => {
    const [lanes, setLanes] = useState([]);
    const [newLaneTitle, setNewLaneTitle] = useState('');
    const [newCardTitle, setNewCardTitle] = useState('');
    const [newCardDescription, setNewCardDescription] = useState('');
    const [boards, setBoards] = useState([]);

    const params = useParams(); // React Router's useParams hook
    const effectiveBoardId = params.boardId; // Assuming boardId is from URL params

    // Fetching boards that belong to the current user
    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const boardsSnapshot = await getDocs(collection(db, 'boards'));
                const userBoards = boardsSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(board => board.createdBy === auth.currentUser.uid);
                setBoards(userBoards);
            } catch (error) {
                console.error('Error fetching boards:', error);
            }
        };

        fetchBoards();
    }, []);

    // Fetching lanes for the selected board
    useEffect(() => {
        const fetchLanes = async () => {
            if (effectiveBoardId) {
                try {
                    const lanesSnapshot = await getDocs(collection(db, `boards/${effectiveBoardId}/lanes`));
                    const lanesData = lanesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setLanes(lanesData);
                } catch (error) {
                    console.error('Error fetching lanes:', error);
                }
            }
        };

        fetchLanes();
    }, [effectiveBoardId]);

    // Function to create a new lane
    const handleCreateLane = async () => {
        if (newLaneTitle.trim() === '') {
            alert('Lane title cannot be empty!');
            return;
        }

        try {
            const newLaneRef = await addDoc(collection(db, `boards/${effectiveBoardId}/lanes`), {
                title: newLaneTitle,
                cards: []
            });
            const newLane = { id: newLaneRef.id, title: newLaneTitle, cards: [] };
            setLanes([...lanes, newLane]);
            console.log(`Created new lane "${newLaneTitle}" in Firestore with ID: ${newLaneRef.id}`);
            setNewLaneTitle('');
        } catch (error) {
            console.error('Error creating lane:', error);
        }
    };

    // Function to handle updating lane title
    const handleUpdateLaneTitle = async (laneId, newTitle) => {
        try {
            const laneRef = doc(db, `boards/${effectiveBoardId}/lanes`, laneId);
            await updateDoc(laneRef, { title: newTitle });
            setLanes(lanes.map(lane => (lane.id === laneId ? { ...lane, title: newTitle } : lane)));
            console.log(`Updated lane "${laneId}" title to "${newTitle}" in Firestore`);
        } catch (error) {
            console.error('Error updating lane title:', error);
        }
    };

    // Function to delete a lane
    const handleDeleteLane = async (laneId) => {
        try {
            const laneRef = doc(db, `boards/${effectiveBoardId}/lanes`, laneId);
            await deleteDoc(laneRef);
            setLanes(lanes.filter(lane => lane.id !== laneId));
            console.log(`Deleted lane "${laneId}" from Firestore`);
        } catch (error) {
            console.error('Error deleting lane:', error);
        }
    };

    // Function to create a new card
    const handleCreateCard = async (laneId, cardTitle, cardDescription) => {
        try {
            const laneRef = doc(db, `boards/${effectiveBoardId}/lanes`, laneId);
            const laneDoc = await getDoc(laneRef);

            if (laneDoc.exists()) {
                const currentDate = new Date().toISOString().split('T')[0];
                const newCard = {
                    id: Date.now().toString(),
                    title: cardTitle,
                    description: cardDescription,
                    label: currentDate
                };

                const updatedCards = [...laneDoc.data().cards, newCard];
                await updateDoc(laneRef, { cards: updatedCards });
                setLanes(lanes.map(lane => (lane.id === laneId ? { ...lane, cards: updatedCards } : lane)));
                console.log(`Created new card "${newCard.title}" in lane "${laneId}" in Firestore`);
            }
        } catch (error) {
            console.error('Error creating card:', error);
        }
    };

    // Function to update a card
    const handleUpdateCard = async (laneId, cardId, updatedTitle, updatedDescription, updatedLabel) => {
        try {
            const laneRef = doc(db, `boards/${effectiveBoardId}/lanes`, laneId);
            const laneDoc = await getDoc(laneRef);

            if (laneDoc.exists()) {
                const updatedCards = laneDoc.data().cards.map(card => {
                    if (card.id === cardId) {
                        return {
                            ...card,
                            title: updatedTitle,
                            description: updatedDescription,
                            label: updatedLabel
                        };
                    }
                    return card;
                });

                await updateDoc(laneRef, { cards: updatedCards });
                setLanes(lanes.map(lane => (lane.id === laneId ? { ...lane, cards: updatedCards } : lane)));
                console.log(`Updated card "${cardId}" in lane "${laneId}" in Firestore`);
            }
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    // Function to delete a card
    const handleDeleteCard = async (laneId, cardId) => {
        try {
            const laneRef = doc(db, `boards/${effectiveBoardId}/lanes`, laneId);
            const laneDoc = await getDoc(laneRef);

            if (laneDoc.exists()) {
                const updatedCards = laneDoc.data().cards.filter(card => card.id !== cardId);
                await updateDoc(laneRef, { cards: updatedCards });
                setLanes(lanes.map(lane => (lane.id === laneId ? { ...lane, cards: updatedCards } : lane)));
                console.log(`Deleted card "${cardId}" from lane "${laneId}" in Firestore`);
            }
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    // Drag and drop functionality
    const handleDragStart = (e, cardId) => {
        e.dataTransfer.setData('cardId', cardId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, targetLaneId) => {
        const cardId = e.dataTransfer.getData('cardId');
        const sourceLane = lanes.find(lane => lane.cards.some(card => card.id === cardId));
        const targetLane = lanes.find(lane => lane.id === targetLaneId);

        if (sourceLane && targetLane && sourceLane.id !== targetLane.id) {
            const cardToMove = sourceLane.cards.find(card => card.id === cardId);
            const updatedSourceCards = sourceLane.cards.filter(card => card.id !== cardId);
            const updatedTargetCards = [...targetLane.cards, cardToMove];

            try {
                await updateDoc(doc(db, `boards/${effectiveBoardId}/lanes`, sourceLane.id), { cards: updatedSourceCards });
                await updateDoc(doc(db, `boards/${effectiveBoardId}/lanes`, targetLane.id), { cards: updatedTargetCards });
                console.log(`Moved card "${cardId}" from lane "${sourceLane.id}" to lane "${targetLane.id}"`);
            } catch (error) {
                console.error('Error moving card:', error);
            }
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="New Lane Title"
                        value={newLaneTitle}
                        onChange={(e) => setNewLaneTitle(e.target.value)}
                    />
                    <button className="btn btn-outline-primary" onClick={handleCreateLane}>
                        Add Lane
                    </button>
                </div>
            </div>
            <div className="row mt-3">
                {lanes.map(lane => (
                    <Lane
                        key={lane.id}
                        lane={lane}
                        onUpdateLaneTitle={handleUpdateLaneTitle}
                        onCreateCard={(title, description) => handleCreateCard(lane.id, title, description)}
                        onUpdateCard={handleUpdateCard}
                        onDeleteCard={handleDeleteCard}
                        onDeleteLane={() => handleDeleteLane(lane.id)}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    />
                ))}
            </div>
        </div>
    );
};

export default TrelloBoard;
