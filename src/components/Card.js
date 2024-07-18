import React, { useState, useEffect } from 'react';
import './Card.css';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';

const Card = ({ card, laneId, onUpdateCard, onDeleteCard, onDragStart }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedDescription, setEditedDescription] = useState(card.description);
  const [editedPriority, setEditedPriority] = useState(card.priority);
  const [editedAssignedTo, setEditedAssignedTo] = useState(card.assignedTo);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUser(user.email); // Assuming you want to use the email as the identifier
      if (!card.assignedTo) {
        setEditedAssignedTo(user.email);
      }
    }
  }, [card.assignedTo]);

  const handleSave = () => {
    onUpdateCard(laneId, card.id, editedTitle, editedDescription, editedPriority, editedAssignedTo);
    setIsEditing(false);
  };

  return (
    <div
      className="card"
      style={{ backgroundColor: getColorByPriority(card.priority) }}
      draggable
      onDragStart={(e) => onDragStart(e, card.id, laneId)}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <input
            type="text"
            value={editedAssignedTo}
            onChange={(e) => setEditedAssignedTo(e.target.value)}
            placeholder="Assigned To"
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <h5>{card.title}</h5>
          <p>{card.description}</p>
          <span>{card.priority}</span>
          <p>Assigned to: {card.assignedto}</p>
          <div className="card-footer">
            <button onClick={() => setIsEditing(true)}>
              <FaPencilAlt />
            </button>
            <button onClick={() => onDeleteCard(laneId, card.id)}>
              <FaTrash />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const getColorByPriority = (priority) => {
  switch (priority) {
    case 'Low':
      return '#d4edda';
    case 'Medium':
      return '#fff3cd';
    case 'High':
      return '#f8d7da';
    case 'Critical':
      return '#f5c6cb';
    default:
      return '#f7f7f7';
  }
};

export default Card;
