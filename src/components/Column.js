// src/components/Column.js
import React, { useState } from 'react';
import Card from './Card';
import './Column.css';
import { colors } from './colorOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Lane = ({
  lane,
  onUpdateLaneTitle,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
  onDeleteLane,
  onDragStart,
  onDragOver,
  onDrop,
  onUpdateLaneColor
}) => {
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newCardPriority, setNewCardPriority] = useState('Low');
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleAddCard = () => {
    if (newCardTitle.trim() === '' || newCardDescription.trim() === '') {
      alert('Card title and description cannot be empty!');
      return;
    }
    onCreateCard(lane.id, newCardTitle, newCardDescription, newCardPriority);
    setNewCardTitle('');
    setNewCardDescription('');
    setNewCardPriority('Low');
    setIsAddingCard(false);
  };

  const handleLaneColorChange = (e) => {
    const newColor = e.target.value;
    onUpdateLaneColor(lane.id, newColor);
  };

  const handleDropInternal = (e) => {
    e.preventDefault();
    onDrop(e, lane.id);
  };

  return (
    <div
      className="column"
      style={{ backgroundColor: lane.color }}
      onDragOver={onDragOver}
      onDrop={handleDropInternal}
    >
      <div className="lane-header">
        <h3 onClick={() => onUpdateLaneTitle(lane.id, prompt('New lane title:', lane.title))}>
          {lane.title}
        </h3>
      </div>
      <div className="lane-cards">
        {lane.cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onUpdateCard={(updatedTitle, updatedDescription, updatedLabel) =>
              onUpdateCard(lane.id, card.id, updatedTitle, updatedDescription, updatedLabel)
            }
            onDeleteCard={() => onDeleteCard(lane.id, card.id)}
            onDragStart={onDragStart}
          />
        ))}
      </div>
      <div className="lane-footer">
        {!isAddingCard ? (
          <button onClick={() => setIsAddingCard(true)} className="add-card-btn">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Card title"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Card description"
              value={newCardDescription}
              onChange={(e) => setNewCardDescription(e.target.value)}
            />
            <select
              value={newCardPriority}
              onChange={(e) => setNewCardPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <button onClick={handleAddCard}>Add Card</button>
            <button onClick={() => setIsAddingCard(false)}>Cancel</button>
          </div>
        )}
        <button className="delete-lane" onClick={() => onDeleteLane(lane.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button className="edit-color">
          <select onChange={handleLaneColorChange} value={lane.color}>
            {colors.map(color => (
              <option key={color} value={color} style={{ backgroundColor: color }}>
                {color}
              </option>
            ))}
          </select>
        </button>
      </div>
    </div>
  );
};

export default Lane;
