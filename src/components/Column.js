import React, { useState } from 'react';
import Card from './Card';
import './Column.css';

const Lane = ({ lane, onUpdateLaneTitle, onCreateCard, onUpdateCard, onDeleteCard, onDeleteLane, onDragStart, onDragOver, onDrop }) => {
    const [newCardTitle, setNewCardTitle] = useState('');
    const [newCardDescription, setNewCardDescription] = useState('');

    const handleCreateCard = () => {
        onCreateCard(newCardTitle, newCardDescription);
        setNewCardTitle('');
        setNewCardDescription('');
    };

    const handleDrop = (e) => {
        const cardId = e.dataTransfer.getData('cardId');
        const sourceLaneId = e.dataTransfer.getData('sourceLaneId');
        onDrop(e, cardId, sourceLaneId, lane.id);
    };

    return (
        <div className="col-md-4 lane" onDragOver={onDragOver} onDrop={handleDrop}>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <input
                        type="text"
                        className="form-control lane-title-input"
                        value={lane.title}
                        onChange={(e) => onUpdateLaneTitle(lane.id, e.target.value)}
                    />
                    <button className="btn btn-danger" onClick={onDeleteLane}>Delete Lane</button>
                </div>
                <div className="card-body">
                    {lane.cards.map(card => (
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
                <div className="card-footer">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="New Card Title"
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                    />
                    <textarea
                        className="form-control mb-2"
                        placeholder="New Card Description"
                        value={newCardDescription}
                        onChange={(e) => setNewCardDescription(e.target.value)}
                    />
                    <button className="btn btn-outline-primary" onClick={handleCreateCard}>
                        Add Card
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Lane;
