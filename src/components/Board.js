import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Board.css';
import { useParams } from 'react-router-dom';
import { db } from './Firebase';
import { collection, getDocs, updateDoc, doc,getDoc,addDoc, deleteDoc } from 'firebase/firestore';
import Lane from './Column';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';



const Board = () => {
  const [lanes, setLanes] = useState([]);
  const [newLaneTitle, setNewLaneTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [boardName, setBoardName] = useState(''); // State to hold board name

  const params = useParams();
  const effectiveBoardId = params.boardId;


  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const boardRef = doc(db, 'boards', effectiveBoardId);
        const boardSnap = await getDoc(boardRef);

        if (boardSnap.exists()) {
          setBoardName(boardSnap.data().name); // Set the board name from Firestore
        } else {
          console.error('Board not found');
          setBoardName('Unknown'); // Placeholder for error handling
        }
      } catch (error) {
        console.error('Error fetching board:', error);
      }
    };

    fetchBoardData();
  }, [effectiveBoardId]);




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

const handleCreateCard = async (laneId, cardTitle, cardDescription, cardPriority, file) => {
    try {
      const laneRef = doc(db, `boards/${effectiveBoardId}/lanes`, laneId);
      const laneDoc = await getDoc(laneRef);
  
      if (laneDoc.exists()) {
        const currentDate = new Date().toISOString().split('T')[0];
        let fileURL = '';
  
        if (file) {
          const storage = getStorage();
          const storageRef = ref(storage, `files/${file.name}`);
          await uploadBytes(storageRef, file);
          fileURL = await getDownloadURL(storageRef);
        }
  
        const newCard = {
          id: Date.now().toString(),
          title: cardTitle,
          description: cardDescription,
          label: currentDate,
          priority: cardPriority,
          fileURL: fileURL
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
  

const handleUpdateCard = async (laneId, cardId, updatedTitle, updatedDescription, updatedLabel, updatedPriority) => {
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
                      label: updatedLabel,
                      priority: updatedPriority
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

const handleDragStart = (e, cardId, laneId) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('laneId', laneId);
};

const handleDragOver = (e) => {
    e.preventDefault();
};

const handleDrop = async (e, targetLaneId) => {
  const cardId = e.dataTransfer.getData('cardId');
  const sourceLaneId = e.dataTransfer.getData('laneId');

  if (sourceLaneId !== targetLaneId) {
    const sourceLane = lanes.find(lane => lane.id === sourceLaneId);
    const targetLane = lanes.find(lane => lane.id === targetLaneId);

    const cardToMove = sourceLane.cards.find(card => card.id === cardId);

    const updatedSourceLaneCards = sourceLane.cards.filter(card => card.id !== cardId);
    const updatedTargetLaneCards = [...targetLane.cards, cardToMove];

    const updatedLanes = lanes.map(lane => {
      if (lane.id === sourceLaneId) {
        return { ...lane, cards: updatedSourceLaneCards };
      }
      if (lane.id === targetLaneId) {
        return { ...lane, cards: updatedTargetLaneCards };
      }
      return lane;
    });

    setLanes(updatedLanes);

    try {
      const sourceLaneRef = doc(db, `boards/${effectiveBoardId}/lanes/${sourceLaneId}`);
      await updateDoc(sourceLaneRef, { cards: updatedSourceLaneCards });

      const targetLaneRef = doc(db, `boards/${effectiveBoardId}/lanes/${targetLaneId}`);
      await updateDoc(targetLaneRef, { cards: updatedTargetLaneCards });
    } catch (error) {
      console.error('Error updating lanes after card drop:', error);
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

const handleUpdateLaneColor = async (laneId, newColor) => {
  try {
      const laneRef = doc(db, `boards/${effectiveBoardId}/lanes`, laneId);
      await updateDoc(laneRef, { color: newColor });
      console.log(`Updated lane "${laneId}" color to "${newColor}" in Firestore`);
  } catch (error) {
      console.error('Error updating lane color:', error);
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
        <h2>{boardName}</h2> {/* Display the board name */}
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
            onCreateCard={handleCreateCard}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
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