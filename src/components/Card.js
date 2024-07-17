import React, { useState } from 'react';

const Card = ({ card, laneId, onUpdateCard, onDeleteCard, onDragStart }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState(card.title);
    const [updatedDescription, setUpdatedDescription] = useState(card.description);
    const [updatedLabel, setUpdatedLabel] = useState(card.label);

    const handleSave = () => {
        onUpdateCard(laneId, card.id, updatedTitle, updatedDescription, updatedLabel);
        setIsEditing(false);
    };

    return (
        <div className="card mb-2" draggable onDragStart={(e) => onDragStart(e, card.id, laneId)}>
            <div className="card-body">
                {isEditing ? (
                    <div>
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={updatedTitle}
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                        />
                        <textarea
                            className="form-control mb-2"
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={updatedLabel}
                            onChange={(e) => setUpdatedLabel(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={handleSave}>Save</button>
                    </div>
                ) : (
                    <div>
                        <h5>{card.title}</h5>
                        <p>{card.description}</p>
                        <span className="badge badge-secondary">{card.label}</span>
                        <div className="d-flex justify-content-end mt-2">
                            <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => setIsEditing(true)}>Edit</button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => onDeleteCard(laneId, card.id)}>Delete</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;
