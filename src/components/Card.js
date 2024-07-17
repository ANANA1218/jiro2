import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import './Card.css';

const Card = ({ card, laneId, onUpdateCard, onDeleteCard, onDragStart }) => {
  const [editMode, setEditMode] = useState(false);
  const [editCardTitle, setEditCardTitle] = useState(card.title);
  const [editCardDescription, setEditCardDescription] = useState(card.description);
  const [editCardPriority, setEditCardPriority] = useState(card.priority);

  const handleUpdateCard = () => {
    if (editCardTitle.trim() === '') {
      alert('Card title cannot be empty!');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    onUpdateCard(laneId, card.id, editCardTitle, editCardDescription, currentDate, editCardPriority);
    setEditMode(false);
  };

  const getCardColor = (priority) => {
    switch (priority) {
      case 'Low':
        return '#DFFFD6'; // Light Green
      case 'Medium':
        return '#FFFDCC'; // Light Yellow
      case 'High':
        return '#FFDFDF'; // Light Red
      case 'Critical':
        return '#FFD9FA'; // Light Purple
      default:
        return '#fff'; // Default white color
    }
  };

  return (
    <div className="list-group-item" draggable onDragStart={(e) => onDragStart(e, card.id)} style={{ backgroundColor: getCardColor(card.priority) }}>
      {editMode ? (
        <>
          <input
            type="text"
            className="form-control mb-1"
            value={editCardTitle}
            onChange={(e) => setEditCardTitle(e.target.value)}
          />
          <textarea
            className="form-control mb-1"
            value={editCardDescription}
            onChange={(e) => setEditCardDescription(e.target.value)}
          />
          <select
            className="form-control mb-1"
            value={editCardPriority}
            onChange={(e) => setEditCardPriority(e.target.value)}
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
            <option value="Critical">Critical Priority</option>
          </select>
          <button className="btn btn-primary btn-sm me-2" onClick={handleUpdateCard}>
            Save
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <h5>{card.title}</h5>
          <p>{card.description}</p>
          <span className="badge bg-primary">{card.label}</span>
          <span className={`badge ${card.priority === 'Critical' ? 'bg-danger' : card.priority === 'High' ? 'bg-warning' : 'bg-secondary'}`}>{card.priority}</span>
          <div className="card-actions mt-2">
            <button className="btn btn-link btn-sm" onClick={() => setEditMode(true)}>
              Edit
            </button>
            <button className="btn btn-link btn-sm text-danger" onClick={() => onDeleteCard(laneId, card.id)}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
