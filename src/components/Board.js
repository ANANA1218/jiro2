import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Board.css';
import { db } from './Firebase'; 
import { collection, getDocs, setDoc, doc, onSnapshot, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import Lane from './Column'; 

const Board = () => {
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
        const currentDate = new Date().toISOString().split('T')[0];
        const newCard = {
          id: Date.now().toString(),
          title: cardTitle,
          description: cardDescription,
          label: currentDate
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
      } else {
        console.log(`Lane "${laneId}" does not exist`);
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
      } else {
        console.log(`Lane "${laneId}" does not exist`);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

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
        await updateDoc(doc(db, 'lanes', sourceLane.id), { cards: updatedSourceCards });
        await updateDoc(doc(db, 'lanes', targetLane.id), { cards: updatedTargetCards });
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
            placeholder="New lane title"
            value={newLaneTitle}
            onChange={(e) => setNewLaneTitle(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleCreateLane}>
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
            onCreateCard={onCreateCard}
            onUpdateCard={onUpdateCard}
            onDeleteCard={onDeleteCard}
            onDeleteLane={handleDeleteLane}
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