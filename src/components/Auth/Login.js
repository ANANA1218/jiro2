import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../Firebase'; // Corriger le chemin d'importation
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await auth.signInWithEmailAndPassword(email, password);
            navigate('/'); // Rediriger après la connexion réussie
        } catch (error) {
            setError('Email ou mot de passe incorrect.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Connexion</h2>
            <form onSubmit={handleLogin}>
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
                <button type="submit" className="btn-auth">Se connecter</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <div className="reset-password-link">
                <Link to="/reset-password">Mot de passe oublié ?</Link>
            </div>
        </div>
    );
};

export default Login;
