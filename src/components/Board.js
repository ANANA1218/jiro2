import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './Firebase';
import { collection, getDocs, updateDoc, doc,getDoc,addDoc, deleteDoc } from 'firebase/firestore';
import Lane from './Column';

const Board = () => {
    const [lanes, setLanes] = useState([]);
    const [newLaneTitle, setNewLaneTitle] = useState('');

    const params = useParams();
    const effectiveBoardId = params.boardId;

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

  /*  const handleDeleteCard = async (laneId, cardId) => {
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
    };*/

    const handleDragStart = (e, cardId) => {
        e.dataTransfer.setData('cardId', cardId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, cardId, sourceLaneId, targetLaneId) => {
        e.preventDefault();
        const sourceLane = lanes.find(lane => lane.id === sourceLaneId);
        const targetLane = lanes.find(lane => lane.id === targetLaneId);
    
        if (sourceLane && targetLane) {
            const cardToMove = sourceLane.cards.find(card => card.id === cardId);
            let updatedSourceCards = [...sourceLane.cards];
            let updatedTargetCards = [...targetLane.cards];
    
            if (sourceLaneId !== targetLaneId) {
                updatedSourceCards = sourceLane.cards.filter(card => card.id !== cardId);
                updatedTargetCards = [...targetLane.cards, cardToMove];
            } else {
                const sourceIndex = sourceLane.cards.findIndex(card => card.id === cardId);
                updatedTargetCards = [...sourceLane.cards];
                updatedTargetCards.splice(sourceIndex, 1);
                updatedTargetCards.splice(e.dataTransfer.getData('index'), 0, cardToMove);
            }
    
            try {
                await updateDoc(doc(db, `boards/${effectiveBoardId}/lanes`, sourceLaneId), { cards: updatedSourceCards });
                await updateDoc(doc(db, `boards/${effectiveBoardId}/lanes`, targetLaneId), { cards: updatedTargetCards });
                console.log(`Moved card "${cardId}" from lane "${sourceLaneId}" to lane "${targetLaneId}"`);
                setLanes(lanes.map(lane => {
                    if (lane.id === sourceLaneId) {
                        return { ...lane, cards: updatedSourceCards };
                    }
                    if (lane.id === targetLaneId) {
                        return { ...lane, cards: updatedTargetCards };
                    }
                    return lane;
                }));
            } catch (error) {
                console.error('Error moving card:', error);
            }
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
                        onDeleteCard={(cardId) => handleDeleteCard(lane.id, cardId)}
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

export default Board;