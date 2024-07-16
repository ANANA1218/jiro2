import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from './Firebase'; // Assuming this imports Firebase Firestore correctly
import { collection, getDocs, setDoc, doc, onSnapshot } from 'firebase/firestore'; // Import necessary Firestore functions
import { v4 as uuidv4 } from 'uuid'; // Import uuid library for generating unique IDs

const TrelloBoard = () => {
  const [lanes, setLanes] = useState([]);
  const [editingCardId, setEditingCardId] = useState(null); // State to track which card is being edited
  const [editFormData, setEditFormData] = useState({ title: '', description: '' }); // State to store edit form data

  // Fetch data from Firestore and set up real-time listener
  useEffect(() => {
    const fetchLanes = async () => {
      try {
        const lanesSnapshot = await getDocs(collection(db, 'lanes'));
        const lanesData = lanesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log('Fetched lanes:', lanesData);

        setLanes(lanesData);
      } catch (error) {
        console.error('Error fetching lanes and cards:', error);
      }
    };

    const unsubscribe = onSnapshot(collection(db, 'lanes'), snapshot => {
      const updatedLanes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Real-time update - Fetched lanes:', updatedLanes);

      setLanes(updatedLanes);
    });

    fetchLanes(); // Fetch once on initial load

    return () => unsubscribe(); // Cleanup the listener
  }, []);

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
        const sourceLaneIndex = lanes.findIndex(lane => lane.id === sourceLaneId);
        const targetLaneIndex = lanes.findIndex(lane => lane.id === targetLaneId);
        const cardIndex = lanes[sourceLaneIndex].cards.findIndex(card => card.id === cardId);

        const card = lanes[sourceLaneIndex].cards.splice(cardIndex, 1)[0];
        lanes[targetLaneIndex].cards.push(card);

        const updatedLanes = lanes.map(lane => ({
          ...lane,
          label: `${lane.cards.length}/${lane.cards.length}`
        }));

        setLanes([...updatedLanes]);

        // Update Firestore
        await Promise.all([
          setDoc(doc(db, 'lanes', sourceLaneId), { cards: lanes[sourceLaneIndex].cards }),
          setDoc(doc(db, 'lanes', targetLaneId), { cards: lanes[targetLaneIndex].cards })
        ]);

        console.log(`Moved card ${cardId} from ${sourceLaneId} to ${targetLaneId} in Firestore`);

      } catch (error) {
        console.error('Error updating Firestore:', error);
      }
    }
  };

  const handleAddCard = async (laneId, cardTitle, cardDescription) => {
    try {
      const newCard = {
        id: uuidv4(),
        title: cardTitle,
        description: cardDescription,
        label: new Date().toLocaleDateString() // Example: Using current date as label
      };

      const targetLaneIndex = lanes.findIndex(lane => lane.id === laneId);
      lanes[targetLaneIndex].cards.push(newCard);

      const updatedLanes = lanes.map(lane => ({
        ...lane,
        label: `${lane.cards.length}/${lane.cards.length}`
      }));

      setLanes([...updatedLanes]);

      await setDoc(doc(db, 'lanes', laneId), { cards: lanes[targetLaneIndex].cards });

      console.log(`Added new card to lane ${laneId} in Firestore`);

    } catch (error) {
      console.error('Error adding new card:', error);
    }
  };

  const handleEditCard = async (laneId, cardId, updatedTitle, updatedDescription) => {
    try {
      const targetLaneIndex = lanes.findIndex(lane => lane.id === laneId);
      const cardIndex = lanes[targetLaneIndex].cards.findIndex(card => card.id === cardId);

      lanes[targetLaneIndex].cards[cardIndex].title = updatedTitle;
      lanes[targetLaneIndex].cards[cardIndex].description = updatedDescription;
      lanes[targetLaneIndex].cards[cardIndex].label = new Date().toLocaleDateString(); // Update label with current date

      const updatedLanes = lanes.map(lane => ({
        ...lane,
        label: `${lane.cards.length}/${lane.cards.length}`
      }));

      setLanes([...updatedLanes]);

      await setDoc(doc(db, 'lanes', laneId), { cards: lanes[targetLaneIndex].cards });

      console.log(`Updated card ${cardId} in lane ${laneId} in Firestore`);

      // Reset editing state
      setEditingCardId(null);
      setEditFormData({ title: '', description: '' });

    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleDeleteCard = async (laneId, cardId) => {
    try {
      const targetLaneIndex = lanes.findIndex(lane => lane.id === laneId);
      const updatedCards = lanes[targetLaneIndex].cards.filter(card => card.id !== cardId);

      lanes[targetLaneIndex].cards = updatedCards;

      const updatedLanes = lanes.map(lane => ({
        ...lane,
        label: `${lane.cards.length}/${lane.cards.length}`
      }));

      setLanes([...updatedLanes]);

      await setDoc(doc(db, 'lanes', laneId), { cards: updatedCards });

      console.log(`Deleted card ${cardId} from lane ${laneId} in Firestore`);

    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditFormSubmit = (e, laneId, cardId) => {
    e.preventDefault();
    handleEditCard(laneId, cardId, editFormData.title, editFormData.description);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {lanes.map(lane => (
          <div key={lane.id} className="col-sm">
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">{lane.title}</h5>
                <p className="card-text">{lane.cards.length}/{lane.cards.length}</p>

                {/* Form for adding a new card */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const title = formData.get('title');
                  const description = formData.get('description');
                  handleAddCard(lane.id, title, description);
                  e.target.reset();
                }}>
                  <div className="mb-3">
                    <input type="text" name="title" className="form-control" placeholder="Title" required />
                  </div>
                  <div className="mb-3">
                    <input type="text" name="description" className="form-control" placeholder="Description" required />
                  </div>
                  <button type="submit" className="btn btn-sm btn-primary mb-2">Add Card</button>
                </form>

                <div className="list-group mt-3" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, lane.id)}>
                  {lane.cards.map(card => (
                    <div key={card.id} className="list-group-item" draggable onDragStart={(e) => handleDragStart(e, card.id, lane.id)}>
                      {editingCardId === card.id ? (
                        <form onSubmit={(e) => handleEditFormSubmit(e, lane.id, card.id)}>
                          <div className="mb-3">
                            <input
                              type="text"
                              name="title"
                              className="form-control"
                              placeholder="Title"
                              value={editFormData.title}
                              onChange={handleEditInputChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              type="text"
                              name="description"
                              className="form-control"
                              placeholder="Description"
                              value={editFormData.description}
                              onChange={handleEditInputChange}
                              required
                            />
                          </div>
                          <button type="submit" className="btn btn-sm btn-success mb-2">Save</button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary mb-2 ms-2"
                            onClick={() => {
                              setEditingCardId(null);
                              setEditFormData({ title: '', description: '' });
                            }}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <>
                          <h6 className="mb-1">{card.title}</h6>
                          <p className="mb-1">{card.description}</p>
                          <small>{card.label}</small>
                          <button
                            className="btn btn-sm btn-danger float-end"
                            onClick={() => handleDeleteCard(lane.id, card.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-sm btn-secondary float-end me-2"
                            onClick={() => {
                              setEditingCardId(card.id);
                              setEditFormData({ title: card.title, description: card.description });
                            }}
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  {lane.cards.length === 0 && <div className="list-group-item empty">Drop here</div>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrelloBoard;
