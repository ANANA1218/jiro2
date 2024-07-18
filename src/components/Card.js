import React, { useState, useEffect } from 'react';
import './Card.css';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import { getUsers } from './Firebase';
import { storage } from './Firebase'; // Importer Firebase Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Card = ({ card, laneId, onUpdateCard, onDeleteCard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedDescription, setEditedDescription] = useState(card.description);
  const [editedPriority, setEditedPriority] = useState(card.priority);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(card.fileURL || '');
  const [users, setUsers] = useState([]);
  const [assignedUser, setAssignedUser] = useState(card.assignedUser || '');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setEditedTitle(card.title);
    setEditedDescription(card.description);
    setEditedPriority(card.priority);
    setFileURL(card.fileURL || '');
    setAssignedUser(card.assignedUser || '');

    const fetchUsers = async () => {
      const usersList = await getUsers();
      setUsers(usersList);
    };
    fetchUsers();
  }, [card]);

  const handleSave = async () => {
    console.log('handleSave called');
    setErrorMessage('');
    let updatedFileURL = fileURL;

    if (file) {
      try {
        console.log('Uploading file:', file.name);
        const fileRef = ref(storage, `files/${file.name}`);
        await uploadBytes(fileRef, file);
        console.log('File uploaded successfully');
        updatedFileURL = await getDownloadURL(fileRef);
        console.log('File URL:', updatedFileURL);
      } catch (error) {
        console.error('Error uploading file:', error);
        setErrorMessage('Error uploading file: ' + error.message);
        toast.error('Error uploading file: ' + error.message);
        return;
      }
    }

    try {
      console.log('Updating card with:', {
        editedTitle,
        editedDescription,
        editedPriority,
        updatedFileURL,
        assignedUser
      });
      await onUpdateCard(laneId, card.id, editedTitle, editedDescription, editedPriority, updatedFileURL, assignedUser);
      setIsEditing(false); // Ferme le formulaire d'édition après la sauvegarde
      toast.success('Card updated successfully!');
    } catch (error) {
      console.error('Error updating card:', error);
      setErrorMessage('Error updating card: ' + error.message);
      toast.error('Error updating card: ' + error.message);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="card" style={{ backgroundColor: getColorByPriority(editedPriority) }} role="article" aria-labelledby={`card-title-${card.id}`}>
      {isEditing ? (
        <>
          <input
            type="text"
            id={`card-title-${card.id}`}
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
          <button onClick={() => setIsEditing(false)}>Cancel</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </>
      ) : (
        <>
          <h5 id={`card-title-${card.id}`}>{card.title}</h5>
          <p>{card.description}</p>
          <span>{card.priority}</span>
          {fileURL && (
            <div className="file-preview">
              <img src={fileURL} alt="Uploaded file" style={{ width: '100%', height: 'auto' }} />
            </div>
          )}
          {assignedUser && <p>Assigné à : {assignedUser}</p>}
          <div className="card-footer">
            <button onClick={() => setIsEditing(true)} aria-label={`Edit card ${card.title}`}>
              <FaPencilAlt />
            </button>
            <button onClick={() => onDeleteCard(laneId, card.id)} aria-label={`Delete card ${card.title}`}>
              <FaTrash />
            </button>
          </div>
        </>
      )}
      <ToastContainer />
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
