import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from './Firebase'; // Assuming this imports Firebase Firestore correctly
import { collection, getDocs, setDoc, doc, onSnapshot } from 'firebase/firestore'; // Import necessary Firestore functions

const TrelloBoard = () => {
  const [lanes, setLanes] = useState([]);

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

  return (
    <div className="container-fluid">
      <div className="row">
        {lanes.map(lane => (
          <div key={lane.id} className="col-sm">
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">{lane.title}</h5>
                <p className="card-text">{lane.cards.length}/{lane.cards.length}</p>
                <div className="list-group" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, lane.id)}>
                  {lane.cards.map(card => (
                    <div key={card.id} className="list-group-item" draggable onDragStart={(e) => handleDragStart(e, card.id, lane.id)}>
                      <h6 className="mb-1">{card.title}</h6>
                      <p className="mb-1">{card.description}</p>
                      <small>{card.label}</small>
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
