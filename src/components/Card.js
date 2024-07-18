import React, { useState, useEffect } from 'react';
import './Card.css';
import { FaTrash, FaPencilAlt, FaUpload } from 'react-icons/fa';
import { getUsers } from './Firebase'; // Importer la fonction getUsers

const Card = ({ card, laneId, onUpdateCard, onDeleteCard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedDescription, setEditedDescription] = useState(card.description);
  const [editedPriority, setEditedPriority] = useState(card.priority);
  const [file, setFile] = useState(card.file);
  const [users, setUsers] = useState([]);
  const [assignedUser, setAssignedUser] = useState(card.assignedUser || '');

  useEffect(() => {
    setEditedTitle(card.title);
    setEditedDescription(card.description);
    setEditedPriority(card.priority);
    setFile(card.file);
    setAssignedUser(card.assignedUser || '');

    // Récupérer les utilisateurs lors du montage du composant
    const fetchUsers = async () => {
      const usersList = await getUsers();
      setUsers(usersList);
    };
    fetchUsers();
  }, [card]);

  const handleSave = () => {
    onUpdateCard(laneId, card.id, editedTitle, editedDescription, editedPriority, file, assignedUser);
    setIsEditing(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="card" style={{ backgroundColor: getColorByPriority(editedPriority) }}>
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
          <input type="file" onChange={handleFileChange} />
          <select
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
          >
            <option value="">Aucun utilisateur assigné</option>
            {users.map(user => (
              <option key={user.id} value={user.email}>{user.email}</option>
            ))}
          </select>
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <h5>{card.title}</h5>
          <p>{card.description}</p>
          <span>{card.priority}</span>
          {file && (
            <div className="file-preview">
              <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer">
                <FaUpload /> {file.name}
              </a>
            </div>
          )}
          {assignedUser && <p>Assigné à : {assignedUser}</p>}
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
