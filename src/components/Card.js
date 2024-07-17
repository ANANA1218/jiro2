import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';

const Card = ({ card, laneId, onUpdateCard, onDeleteCard, onDragStart }) => {
  const [editMode, setEditMode] = useState(false);
  const [editCardTitle, setEditCardTitle] = useState(card.title);
  const [editCardDescription, setEditCardDescription] = useState(card.description);
  const [editCardLabel, setEditCardLabel] = useState(card.label);

  const handleUpdateCard = () => {
    if (editCardTitle.trim() === '') {
      alert('Card title cannot be empty!');
      return;
    }

    onUpdateCard(laneId, card.id, editCardTitle, editCardDescription, editCardLabel);
    setEditMode(false);
  };

  return (
    <div className="list-group-item" draggable onDragStart={(e) => onDragStart(e, card.id)}>
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
          <input
            type="text"
            className="form-control mb-1"
            value={editCardLabel}
            onChange={(e) => setEditCardLabel(e.target.value)}
          />
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
          <div className="card-actions mt-2">
            <button className="btn btn-link btn-sm" onClick={() => setEditMode(true)}>
              Edit
            </button>
            <button className="btn btn-link btn-sm text-danger" onClick={() => onDeleteCard(card.id)}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
