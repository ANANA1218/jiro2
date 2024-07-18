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
  const [editedPicture, setEditedPicture] = useState(card.picture);
  const [isImageExpanded, setIsImageExpanded] = useState(false); // State to track if image is expanded
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
    onUpdateCard(laneId, card.id, editedTitle, editedDescription, editedPriority, editedAssignedTo, editedPicture);
    setIsEditing(false);
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedPicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleImageExpand = () => {
    setIsImageExpanded(!isImageExpanded);
  };

  const closeExpandedImage = () => {
    setIsImageExpanded(false);
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
          <input
            type="file"
            onChange={handlePictureChange}
            accept="image/*"
          />
          {editedPicture && (
            <>
              {isImageExpanded ? (
                <div className="expanded-picture-container" onClick={closeExpandedImage}>
                  <img src={editedPicture} alt="Expanded Card" className="expanded-picture" />
                </div>
              ) : (
                <img
                  src={editedPicture}
                  alt="Card"
                  className={`card-picture`}
                  onClick={toggleImageExpand} // Enable click to expand image
                />
              )}
            </>
          )}
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <h5>{card.title}</h5>
          <p>{card.description}</p>
          <span>{card.priority}</span>
          <p>Assigned to: {card.assignedto}</p>
          {card.picture && (
            <>
              {isImageExpanded ? (
                <div className="expanded-picture-container" onClick={closeExpandedImage}>
                  <img src={card.picture} alt="Expanded Card" className="expanded-picture" />
                </div>
              ) : (
                <img
                  src={card.picture}
                  alt="Card"
                  className={`card-picture`}
                  onClick={toggleImageExpand} // Enable click to expand image
                />
              )}
            </>
          )}
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
