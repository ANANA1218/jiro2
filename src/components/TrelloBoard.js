import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TrelloBoard.css'; // Import custom CSS file
import { db } from './Firebase'; // Import your Firebase configuration
import {
  collection,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  deleteDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {  signOut } from "firebase/auth";

const TrelloBoard = () => {
  const [lanes, setLanes] = useState([]);
  const [newLaneTitle, setNewLaneTitle] = useState('');
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [editCardId, setEditCardId] = useState('');
  const [editCardTitle, setEditCardTitle] = useState('');
  const [editCardDescription, setEditCardDescription] = useState('');
  const [editCardLabel, setEditCardLabel] = useState('');

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

  const handleCreateCard = async (laneId) => {
    if (newCardTitle.trim() === '') {
      alert('Card title cannot be empty!');
      return;
    }

    try {
      const dateLabel = new Date().toLocaleString();
      await createCard(laneId, newCardTitle, newCardDescription, dateLabel);
      setNewCardTitle('');
      setNewCardDescription('');
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const handleUpdateCard = async (laneId) => {
    if (editCardTitle.trim() === '') {
      alert('Card title cannot be empty!');
      return;
    }

    try {
      await updateCard(laneId, editCardId, editCardTitle, editCardDescription, editCardLabel);
      setEditCardId('');
      setEditCardTitle('');
      setEditCardDescription('');
      setEditCardLabel('');
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleDeleteCard = async (laneId, cardId) => {
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

  const handleDeleteLane = async (laneId) => {
    try {
      const laneRef = doc(db, 'lanes', laneId);
      await deleteDoc(laneRef);
      console.log(`Deleted lane "${laneId}" from Firestore`);
    } catch (error) {
      console.error('Error deleting lane:', error);
    }
  };

  const handleDragStart = (e, cardId, laneId) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('laneId', laneId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetLaneId) => {
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
          // Find the card in the source lane
          const cardIndex = sourceLaneDoc.data().cards.findIndex(card => card.id === cardId);

          if (cardIndex !== -1) {
            const card = sourceLaneDoc.data().cards[cardIndex];
            
            // Remove the card from the source lane
            const updatedSourceCards = [...sourceLaneDoc.data().cards];
            updatedSourceCards.splice(cardIndex, 1);

            // Add the card to the target lane
            const updatedTargetCards = [...targetLaneDoc.data().cards, card];

            // Update Firestore with the new card lists
            await Promise.all([
              updateDoc(sourceLaneRef, { cards: updatedSourceCards }),
              updateDoc(targetLaneRef, { cards: updatedTargetCards })
            ]);

            console.log(`Moved card "${cardId}" from "${sourceLaneId}" to "${targetLaneId}" in Firestore`);
          }
        } else if (!sourceLaneDoc.exists() && targetLaneDoc.exists()) {
          // If source lane doesn't exist, create an empty one to move the card
          const updatedTargetCards = [...targetLaneDoc.data().cards, { id: cardId, title: '', description: '', label: '' }];

          await updateDoc(targetLaneRef, { cards: updatedTargetCards });

          console.log(`Moved card "${cardId}" to "${targetLaneId}" in Firestore`);
        }
      } catch (error) {
        console.error('Error updating Firestore:', error);
      }
    }
  };

  const handleEditCard = (cardId, title, description, label) => {
    setEditCardId(cardId);
    setEditCardTitle(title);
    setEditCardDescription(description);
    setEditCardLabel(label);
  };

  const updateCard = async (laneId, cardId, updatedTitle, updatedDescription, updatedLabel) => {
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

  const createCard = async (laneId, cardTitle, cardDescription, cardLabel) => {
    try {
      const laneRef = doc(db, 'lanes', laneId);
      const laneDoc = await getDoc(laneRef);

      if (laneDoc.exists()) {
        const newCard = {
          id: Date.now().toString(), // Use a unique ID (e.g., timestamp)
          title: cardTitle,
          description: cardDescription,
          label: cardLabel
        };

        const updatedCards = [...laneDoc.data().cards, newCard];
        await updateDoc(laneRef, { cards: updatedCards });
        console.log(`Created new card "${newCard.title}" in lane "${laneId}" in Firestore`);
      }
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };


  const navigate = useNavigate();
 
  const handleLogout = () => {               
      signOut(auth).then(() => {
      // Sign-out successful.
          navigate("/");
          console.log("Signed out successfully")
      }).catch((error) => {
      // An error happened.
      });
  }


  
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
          <div key={lane.id} className="col-md-4">
            <div className="card mt-3">
              <div className="card-body">
                <input
                  type="text"
                  className="card-title form-control mb-2"
                  value={lane.title}
                  onChange={(e) => handleUpdateLaneTitle(lane.id, e.target.value)}
                />
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Card title"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                  />
                  <textarea
                    className="form-control"
                    placeholder="Card description"
                    value={newCardDescription}
                    onChange={(e) => setNewCardDescription(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={() => handleCreateCard(lane.id)}
                  >
                    Add Card
                  </button>
                </div>
                <div
                  className="list-group"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, lane.id)}
                >
                  {lane.cards.map(card => (
                    <div
                      key={card.id}
                      className="list-group-item"
                      draggable
                      onDragStart={(e) => handleDragStart(e, card.id, lane.id)}
                    >
                      {editCardId === card.id ? (
                        <>
                          <input
                            type="text"
                            className="form-control mb-1"
                            value={editCardTitle}
                            onChange={(e) => setEditCardTitle(e.target.value)}
                          />
                          <textarea
                            className="form-control mb-1"
                            value={editCardDescription}
                            onChange={(e) => setEditCardDescription(e.target.value)}
                          />
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handleUpdateCard(lane.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setEditCardId('');
                              setEditCardTitle('');
                              setEditCardDescription('');
                              setEditCardLabel('');
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <h5>{card.title}</h5>
                          <p>{card.description}</p>
                          <span className="badge bg-primary">{card.label}</span>
                          <div className="card-actions mt-2">
                            <button
                              className="btn btn-link btn-sm"
                              onClick={() => handleEditCard(card.id, card.title, card.description, card.label)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-link btn-sm text-danger"
                              onClick={() => handleDeleteCard(lane.id, card.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {/* Placeholder for dropping when the list is empty */}
                  {lane.cards.length === 0 && (
                    <div
                      className="list-group-item placeholder"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, lane.id)}
                    >
                      Drop here
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-danger btn-sm mt-3"
                  onClick={() => handleDeleteLane(lane.id)}
                >
                  Delete Lane
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrelloBoard;
