import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from './Card';

const Column = ({ lane, handleDragOver, handleDrop, handleDragStart }) => {
  return (
    <div key={lane.id} className="col-sm">
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">{lane.title}</h5>
          <p className="card-text">{lane.label}</p>
          <div className="list-group" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e, lane.id)}>
            {lane.cards.map(card => (
              <Card key={card.id} card={card} handleDragStart={(e, cardId) => handleDragStart(e, cardId, lane.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Column;
