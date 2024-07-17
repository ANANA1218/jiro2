import React, { useState } from 'react';
import Card from './Card';
import './Column.css';

const Column = ({ lane, onUpdateLaneTitle, onCreateCard, onUpdateCard, onDeleteCard, onDeleteLane, onDragStart, onDragOver, onDrop }) => {
    const [newCardTitle, setNewCardTitle] = useState('');
    const [newCardDescription, setNewCardDescription] = useState('');


    const handleCreateCard = () => {
        if (newCardTitle.trim() === '') {
            alert('Card title cannot be empty!');
            return;
        }

        onCreateCard(newCardTitle, newCardDescription);
        setNewCardTitle('');
        setNewCardDescription('');
    };

    return (
        <div className="col-md-4">
            <div className="card mt-3">
                <div className="card-body">
                    <input
                        type="text"
                        className="card-title form-control mb-2"
                        value={lane.title}
                        onChange={(e) => onUpdateLaneTitle(lane.id, e.target.value)}
                    />
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Card title"
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                        />
                        <textarea
                            className="form-control"
                            placeholder="Card description"
                            value={newCardDescription}
                            onChange={(e) => setNewCardDescription(e.target.value)}
                        />
                        <button
                            className="btn btn-outline-primary"
                            type="button"
                            onClick={handleCreateCard}
                        >
                            Add Card
                        </button>
                    </div>
                    <div
                        className="list-group"
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, lane.id)}
                    >
                        {lane.cards.map(card => (
                            <Card
                                key={card.id}
                                card={card}
                                laneId={lane.id}
                                onUpdateCard={onUpdateCard}
                                onDeleteCard={(cardId) => onDeleteCard(lane.id, cardId)}
                                onDragStart={onDragStart}
                            />
                        ))}
                    </div>
                    <button
                        className="btn btn-danger btn-sm mt-3"
                        onClick={() => onDeleteLane(lane.id)}
                    >
                        Delete Lane
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Column;