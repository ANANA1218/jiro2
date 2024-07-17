// src/components/Card.js
import React from 'react';
import './Card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Card = ({ card, onUpdateCard, onDeleteCard, onDragStart }) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Low':
        return 'card-low';
      case 'Medium':
        return 'card-medium';
      case 'High':
        return 'card-high';
      case 'Critical':
        return 'card-critical';
      default:
        return '';
    }
  };

  return (
    <div
      className={`card ${getPriorityClass(card.priority)}`}
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
    >
      <h4>{card.title}</h4>
      <p>{card.description}</p>
      <p>{card.label}</p>
      <div className="card-footer">
        <button onClick={() => onUpdateCard(card.id)} className="edit-card-btn">
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
        <button onClick={() => onDeleteCard(card.id)} className="delete-card-btn">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default Card;

