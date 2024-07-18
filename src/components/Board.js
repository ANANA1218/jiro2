// Board.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Board.css';
import { db, getUsers } from './Firebase'; // Importer getUsers
import { collection, getDocs, setDoc, doc, onSnapshot, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import Lane from './Column';
import { colors } from './colorOptions';

const Board = () => {
  const [lanes, setLanes] = useState([]);
  const [newLaneTitle, setNewLaneTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [users, setUsers] = useState([]);

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

    const fetchUsers = async () => {
      const usersList = await getUsers();
      setUsers(usersList);
    };

    fetchLanes();
    fetchUsers();

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
        color: colors[0],
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

  const handleUpdateLaneColor = async (laneId, newColor) => {
    try {
      const laneRef = doc(db, 'lanes', laneId);
      await updateDoc(laneRef, { color: newColor });
      console.log(`Updated lane "${laneId}" color to "${newColor}" in Firestore`);
    } catch (error) {
      console.error('Error updating lane color:', error);
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

  const onCreateCard = async (laneId, cardTitle, cardDescription, cardPriority, assignedUser) => {
    try {
      const laneRef = doc(db, 'lanes', laneId);
      const laneDoc = await getDoc(laneRef);

      if (laneDoc.exists()) {
        const currentDate = new Date().toISOString().split('T')[0];
        const newCard = {
          id: Date.now().toString(),
          title: cardTitle,
          description: cardDescription,
          priority: cardPriority,
          label: currentDate,
          assignedUser: assignedUser || '' // Ajout de l'utilisateur assigné
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

  // Utiliser la fonction existante pour inclure la mise à jour de l'utilisateur assigné
  const onUpdateCard = async (laneId, cardId, updatedTitle, updatedDescription, updatedPriority, updatedFileURL, updatedUser) => {
    console.log('onUpdateCard called with:', {
      laneId,
      cardId,
      updatedTitle,
      updatedDescription,
      updatedPriority,
      updatedFileURL,
      updatedUser
    });
  
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
              priority: updatedPriority,
              fileURL: updatedFileURL, // Mise à jour de l'URL du fichier
              assignedUser: updatedUser // Mise à jour de l'utilisateur assigné
            };
          }
          return card;
        });
  
        await updateDoc(laneRef, { cards: updatedCards });
        setLanes(lanes.map(lane => (lane.id === laneId ? { ...lane, cards: updatedCards } : lane)));
        console.log(`Updated card "${cardId}" in lane "${laneId}" in Firestore`);
      } else {
        console.log(`Lane "${laneId}" does not exist`);
      }
    } catch (error) {
      console.error('Error updating card:', error);
      throw error; // Rejeter l'erreur pour que handleSave puisse la gérer
    }
  };
  
  
  
  
  

  const onDeleteCard = async (laneId, cardId) => {
    try {
      const laneRef = doc(db, 'lanes', laneId);
      const laneDoc = await getDoc(laneRef);

      if (laneDoc.exists()) {
        const updatedCards = laneDoc.data().cards.filter(card => card.id !== cardId);
        await updateDoc(laneRef, { cards: updatedCards });
        setLanes(lanes.map(lane => (lane.id === laneId ? { ...lane, cards: updatedCards } : lane)));
        console.log(`Deleted card "${cardId}" from lane "${laneId}" in Firestore`);
      } else {
        console.log(`Lane "${laneId}" does not exist`);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleDragStart = (e, cardId, sourceLaneId) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('sourceLaneId', sourceLaneId);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (e, cardId, sourceLaneId, targetLaneId) => {
    e.preventDefault();
    const sourceLane = lanes.find(lane => lane.id === sourceLaneId);
    const targetLane = lanes.find(lane => lane.id === targetLaneId);

    if (sourceLane && targetLane) {
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

  const filteredLanes = lanes.map(lane => ({
    ...lane,
    cards: lane.cards.filter(card => {
      const matchesPriority = filterPriority === 'All' || card.priority === filterPriority;
      const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPriority && matchesSearch;
    })
  }));

  return (
    <div className="board-container">
      <div className="board-header">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="New lane title"
            value={newLaneTitle}
            onChange={(e) => setNewLaneTitle(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleCreateLane}>
            Add Lane
          </button>
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search cards"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-group">
          <select
            className="form-control"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>
      <div className="board">
        {filteredLanes.map(lane => (
          <Lane
            key={lane.id}
            lane={lane}
            onUpdateLaneTitle={handleUpdateLaneTitle}
            onCreateCard={onCreateCard}
            onUpdateCard={onUpdateCard} // Utiliser la fonction mise à jour
            onDeleteCard={onDeleteCard}
            onDeleteLane={handleDeleteLane}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onUpdateLaneColor={handleUpdateLaneColor}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
