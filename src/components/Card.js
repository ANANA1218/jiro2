import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Card = ({ card, handleDragStart }) => {
  return (
    <div key={card.id} className="list-group-item" draggable onDragStart={(e) => handleDragStart(e, card.id)}>
      <h6 className="mb-1">{card.title}</h6>
      <p className="mb-1">{card.description}</p>
      <small>{card.label}</small>
    </div>
  );
};

export default Card;
