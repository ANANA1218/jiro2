import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { auth } from '../Firebase'; // Assurez-vous que c'est correctement configuré
import { sendPasswordResetEmail } from 'firebase/auth';
import './Resetpassword.css';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Un email de réinitialisation a été envoyé à votre adresse.');
        } catch (error) {
            setError('Une erreur est survenue. Veuillez vérifier votre adresse email.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Réinitialiser le mot de passe</h2>
            <form onSubmit={handleResetPassword}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Entrez votre adresse email"
                        required
                    />
                </div>
                <button type="submit" className="btn-auth">Envoyer</button>
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
            </form>
            <p>
                Déjà un compte?{' '}
                <NavLink to="/login">
                    Connectez-vous
                </NavLink>
            </p>     
        </div>
    );
};

export default ResetPassword;
