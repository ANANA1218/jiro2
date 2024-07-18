import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../Firebase'; // Assurez-vous que c'est correctement configuré
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import './Signup.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Envoi de l'email de vérification
            await sendEmailVerification(auth.currentUser);
            
            const user = userCredential.user;
            console.log(user);
            
            // Redirection vers la page de connexion après inscription réussie
            navigate("/login");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Inscription</h2>
            <form onSubmit={onSubmit}>
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
            <p>
                Déjà un compte?{' '}
                <NavLink to="/login">
                    Connectez-vous
                </NavLink>
            </p>     
        </div>
    );
};

export default Signup;
