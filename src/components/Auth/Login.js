import React, { useState } from 'react';
import { NavLink,useNavigate, Link } from 'react-router-dom';
import { auth } from '../Firebase'; // Corriger le chemin d'importation
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

  /**  const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await auth.signInWithEmailAndPassword(email, password);
            navigate('/'); // Rediriger après la connexion réussie
        } catch (error) {
            setError('Email ou mot de passe incorrect.');
        }
    };
*/


const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/")
        console.log(user);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
    });
   
}
    return (
        <div className="auth-container">
            <h2>Connexion</h2>
            <form onSubmit={onLogin}>
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
            <p className="text-sm text-white text-center">
             No account yet? {' '}
             <NavLink to="/signup">
                 Sign up
             </NavLink>
                        </p>
        </div>
    );
};

export default Login;
