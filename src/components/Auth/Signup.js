import React, { useState } from 'react';



const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');



    return (
        <div className="auth-container">
            <h2>Inscription</h2>
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
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Entrez votre mot de passe"
                        required
                    />
                </div>
                <button type="submit" className="btn-auth">S'inscrire</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Signup;
