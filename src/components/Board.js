import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TrelloBoard.css'; // Import custom CSS file
import { db } from './Firebase'; // Import your Firebase configuration
import { collection, getDocs, setDoc, doc, onSnapshot, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import Lane from './Column'; // Import your Lane component

const TrelloBoard = () => {
  const [lanes, setLanes] = useState([]);
  const [newLaneTitle, setNewLaneTitle] = useState('');

  useEffect(() => {
    const fetchLanes = async () => {
      try {
        const lanesSnapshot = await getDocs(collection(db, 'lanes'));
        const lanesData = lanesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLanes(lanesData);
      } catch (error) {
        console.error('Error fetching lanes:', error);
      }
    }; 

    const unsubscribe = onSnapshot(collection(db, 'lanes'), snapshot => {
      const updatedLanes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLanes(updatedLanes);
    });

    fetchLanes();

    return () => unsubscribe();
  }, []);

  const handleCreateLane = async () => {
    if (newLaneTitle.trim() === '') {
      alert('Lane title cannot be empty!');
      return;
    }

    try {
      const newLaneRef = doc(collection(db, 'lanes'));
      const newLane = {
        title: newLaneTitle,
        cards: []
      };

      await setDoc(newLaneRef, newLane);
      console.log(`Created new lane "${newLaneTitle}" in Firestore`);
      setNewLaneTitle('');
    } catch (error) {
      console.error('Error creating lane:', error);
    }
  };

  const handleUpdateLaneTitle = async (laneId, newTitle) => {
    try {
      const laneRef = doc(db, 'lanes', laneId);
      await updateDoc(laneRef, { title: newTitle });
      console.log(`Updated lane "${laneId}" title to "${newTitle}" in Firestore`);
    } catch (error) {
      console.error('Error updating lane title:', error);
    }
  };

  const handleDeleteLane = async (laneId) => {
    try {
      const laneRef = doc(db, 'lanes', laneId);
      await deleteDoc(laneRef);
      console.log(`Deleted lane "${laneId}" from Firestore`);
    } catch (error) {
      console.error('Error deleting lane:', error);
    }
  };

  const onCreateCard = async (laneId, cardTitle, cardDescription) => {
    try {
      const laneRef = doc(db, 'lanes', laneId);
      const laneDoc = await getDoc(laneRef);

      if (laneDoc.exists()) {
        const newCard = {
          id: Date.now().toString(),
          title: cardTitle,
          description: cardDescription,
          label: ''
        };

        const updatedCards = [...laneDoc.data().cards, newCard];
        await updateDoc(laneRef, { cards: updatedCards });
        console.log(`Created new card "${newCard.title}" in lane "${laneId}" in Firestore`);
      }
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const onUpdateCard = async (laneId, cardId, updatedTitle, updatedDescription, updatedLabel) => {
    try {
      const laneRef = doc(db, 'lanes', laneId);
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
        console.log(`Updated card "${cardId}" in lane "${laneId}" in Firestore`);
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };
 

  const onDeleteCard = async (laneId, cardId) => {
    try {
      const laneRef = doc(db, 'lanes', laneId);
      const laneDoc = await getDoc(laneRef);

      if (laneDoc.exists()) {
        const updatedCards = laneDoc.data().cards.filter(card => card.id !== cardId);
        await updateDoc(laneRef, { cards: updatedCards });
        console.log(`Deleted card "${cardId}" from lane "${laneId}" in Firestore`);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const onEditCard = (laneId, cardId, newTitle, newDescription, newLabel) => {
    // Implement logic to set the card into edit mode in the UI
    // This function should handle how the Card component switches to edit mode
    // You can use local state or any UI state management technique here
    console.log(`Editing card "${cardId}" in lane "${laneId}"`);
    // Example:
    // setEditMode(true);
    // setEditCardTitle(newTitle);
    // setEditCardDescription(newDescription);
    // setEditCardLabel(newLabel);
  };

  const onDragStart = (e, cardId, laneId) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('laneId', laneId);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (e, targetLaneId) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    const sourceLaneId = e.dataTransfer.getData('laneId');

    if (sourceLaneId !== targetLaneId) {
      try {
        const sourceLaneRef = doc(db, 'lanes', sourceLaneId);
        const targetLaneRef = doc(db, 'lanes', targetLaneId);

        const sourceLaneDoc = await getDoc(sourceLaneRef);
        const targetLaneDoc = await getDoc(targetLaneRef);

        if (sourceLaneDoc.exists() && targetLaneDoc.exists()) {
          const cardIndex = sourceLaneDoc.data().cards.findIndex(card => card.id === cardId);

          if (cardIndex !== -1) {
            const card = sourceLaneDoc.data().cards[cardIndex];
            const updatedSourceCards = [...sourceLaneDoc.data().cards];
            updatedSourceCards.splice(cardIndex, 1);
            const updatedTargetCards = [...targetLaneDoc.data().cards, card];

            await Promise.all([
              updateDoc(sourceLaneRef, { cards: updatedSourceCards }),
              updateDoc(targetLaneRef, { cards: updatedTargetCards })
            ]);

            console.log(`Moved card "${cardId}" from "${sourceLaneId}" to "${targetLaneId}" in Firestore`);
          }
        } else if (!sourceLaneDoc.exists() && targetLaneDoc.exists()) {
          const updatedTargetCards = [...targetLaneDoc.data().cards, { id: cardId, title: '', description: '', label: '' }];
          await updateDoc(targetLaneRef, { cards: updatedTargetCards });

          console.log(`Moved card "${cardId}" to "${targetLaneId}" in Firestore`);
        }
      } catch (error) {
        console.error('Error updating Firestore:', error);
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12 text-center">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter lane title"
              value={newLaneTitle}
              onChange={(e) => setNewLaneTitle(e.target.value)}
            />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={handleCreateLane}
            >
              Add Lane
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        {lanes.map(lane => (
          <Lane
            key={lane.id}
            lane={lane}
            onUpdateLaneTitle={handleUpdateLaneTitle}
            onCreateCard={onCreateCard}
            onUpdateCard={onUpdateCard}
            onDeleteCard={onDeleteCard}
            onDeleteLane={handleDeleteLane}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onEditCard={onEditCard} // Pass onEditCard as prop
          />
        ))}
      </div>
    </div>
  );
};

export default TrelloBoard;
