import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const TrelloBoard = () => {
  // Initial board data
  const [lanes, setLanes] = useState([
    {
      id: 'lane1',
      title: 'Planned Tasks',
      label: '2/2',
      cards: [
        { id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins' },
        { id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins' }
      ]
    },
    {
      id: 'lane3',
      title: 'Work in progress',
      label: '1/1',
      cards: [
        { id: 'Card3', title: 'Clean house', description: 'Clean house (bath, living room, kitchen)', label: '30 mins' }
      ]
    },
    {
      id: 'lane2',
      title: 'Completed',
      label: '1/1',
      cards: [
        { id: 'Card4', title: 'Buy a cup of tea', description: 'Herbal tea', label: '30 mins' }
      ]
    }
  ]);

  // Drag and drop handlers
  const handleDragStart = (e, cardId, laneId) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('laneId', laneId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetLaneId) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    const sourceLaneId = e.dataTransfer.getData('laneId');

    if (sourceLaneId !== targetLaneId) {
      // Find the card and lane from where it was dragged
      const sourceLaneIndex = lanes.findIndex(lane => lane.id === sourceLaneId);
      const targetLaneIndex = lanes.findIndex(lane => lane.id === targetLaneId);
      const cardIndex = lanes[sourceLaneIndex].cards.findIndex(card => card.id === cardId);

      // Remove the card from the source lane
      const card = lanes[sourceLaneIndex].cards.splice(cardIndex, 1)[0];

      // Add the card to the target lane
      lanes[targetLaneIndex].cards.push(card);

      // Update the state
      setLanes([...lanes]);
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
                <p className="card-text">{lane.label}</p>
                <div className="list-group" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, lane.id)}>
                  {lane.cards.map(card => (
                    <div key={card.id} className="list-group-item" draggable onDragStart={(e) => handleDragStart(e, card.id, lane.id)}>
                      <h6 className="mb-1">{card.title}</h6>
                      <p className="mb-1">{card.description}</p>
                      <small>{card.label}</small>
                    </div>
                  ))}
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
