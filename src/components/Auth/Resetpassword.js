import React, { useState } from 'react';
import { auth } from '../Firebase'; // Corriger le chemin d'importation
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
            await auth.sendPasswordResetEmail(email);
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
        </div>
    );
};

export default ResetPassword;
