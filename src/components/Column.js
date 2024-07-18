import React, { useState, useEffect } from 'react';
import './Column.css';
import { FaPlus, FaTrash, FaPalette } from 'react-icons/fa';
import Card from './Card';
import { colors } from './colorOptions';
import { getAuth } from 'firebase/auth';

const Column = ({ lane, onUpdateLaneTitle, onCreateCard, onUpdateCard, onDeleteCard, onDeleteLane, onUpdateLaneColor, onDragStart, onDragOver, onDrop }) => {
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newCardPriority, setNewCardPriority] = useState('Low');
  const [newCardAssignedTo, setNewCardAssignedTo] = useState('');
  const [newCardPicture, setNewCardPicture] = useState('');
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUser(user.email); // Assuming you want to use the email as the identifier
      setNewCardAssignedTo(user.email); // Set the default assigned user
    }
  }, []);

  const handleCreateCard = () => {
    if (newCardTitle.trim() === '') {
      alert('Card title cannot be empty!');
      return;
    }
    onCreateCard(lane.id, newCardTitle, newCardDescription, newCardPriority, newCardAssignedTo, newCardPicture);
    setNewCardTitle('');
    setNewCardDescription('');
    setNewCardPriority('Low');
    setNewCardAssignedTo(currentUser); // Reset to the current user after creation
    setNewCardPicture('');
    setShowNewCardForm(false);
  };

  const handleColorChange = (color) => {
    onUpdateLaneColor(lane.id, color);
    setShowColorOptions(false);
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCardPicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="column"
      style={{ backgroundColor: lane.color }}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, lane.id)}
    >
      <div className="lane-header">
        <input
          type="text"
          value={lane.title}
          onChange={(e) => onUpdateLaneTitle(lane.id, e.target.value)}
          className="lane-title"
        />
        <button className="edit-color" onClick={() => setShowColorOptions(!showColorOptions)}>
          <FaPalette />
        </button>
        {showColorOptions && (
          <div className="color-options">
            {colors.map((color, index) => (
              <div
                key={index}
                className="color-option"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="lane-cards">
        {lane.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            laneId={lane.id}
            onUpdateCard={onUpdateCard}
            onDeleteCard={onDeleteCard}
            onDragStart={onDragStart}
          />
        ))}
      </div>
      {showNewCardForm ? (
        <div className="new-card-form">
          <input
            type="text"
            placeholder="Card title"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            className="form-control mb-2"
          />
          <textarea
            placeholder="Card description"
            value={newCardDescription}
            onChange={(e) => setNewCardDescription(e.target.value)}
            className="form-control mb-2"
          />
          <select
            value={newCardPriority}
            onChange={(e) => setNewCardPriority(e.target.value)}
            className="form-control mb-2"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <input
            type="text"
            placeholder="Assigned to"
            value={newCardAssignedTo}
            onChange={(e) => setNewCardAssignedTo(e.target.value)}
            className="form-control mb-2"
          />
          <input
            type="file"
            onChange={handlePictureChange}
            accept="image/*"
            className="form-control mb-2"
          />
          <button className="btn btn-primary" onClick={handleCreateCard}>
            Add Card
          </button>
        </div>
      ) : (
        <button className="add-card-btn" onClick={() => setShowNewCardForm(true)}>
          <FaPlus />
        </button>
      )}
      <div className="lane-footer">
        <button className="delete-lane" onClick={() => onDeleteLane(lane.id)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default Column;
