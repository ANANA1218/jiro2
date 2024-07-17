
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './Firebase';
import { Link } from 'react-router-dom';

const Home = () => {
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const email = user.email;
                setUserEmail(email);
            } else {
                setUserEmail(null); // L'utilisateur n'est pas connecté
            }
        });

        return () => unsubscribe();
    }, []);
 
    return (
        <section>
            <h2>Welcome, {userEmail}</h2>
            <Link to="/new-board">
                <button>Create New Board</button>
            </Link>
        </section>
    );
}
 
export default Home;
