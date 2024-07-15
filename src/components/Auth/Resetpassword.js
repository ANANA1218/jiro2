import React, { useState } from 'react';



const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

   

    return (
        <div className="auth-container">
            <h2>Réinitialiser le mot de passe</h2>
            <form >
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
