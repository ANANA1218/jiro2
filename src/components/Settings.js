import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { auth, db } from './Firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './Settings.css';

const avatars = [
    'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Photos.png',
    'https://www.pngarts.com/files/5/User-Avatar-PNG-Picture.png',
    'https://as1.ftcdn.net/v2/jpg/02/69/39/54/1000_F_269395480_mOemLksOi7lYwADZ2mXKU78l4MyISbt5.jpg',
    'https://cdn2.iconfinder.com/data/icons/veterinary-12/512/Veterinary_Icons-16-512.png'
    // Add more avatar URLs as needed
];

const Settings = () => {
    const { setTheme, themes } = useContext(ThemeContext);
    const [user, setUser] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const themeKeys = ['theme1', 'theme2', 'theme3', 'theme4', 'theme5', 'theme6'];  // Assuming these themes exist

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
            if (userAuth) {
                setUser(userAuth);
                // Set the selected avatar from the user's profile if available
                setSelectedAvatar(userAuth.photoURL || avatars[0]);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleAvatarSelect = (avatar) => {
        if (user) {
            // Update the user's profile photoURL
            updateDoc(doc(db, 'users', user.uid), { photoURL: avatar })
                .then(() => {
                    console.log('Avatar updated successfully.');
                    setSelectedAvatar(avatar);
                })
                .catch((error) => {
                    console.error('Error updating avatar:', error);
                });
        }
    };

    const handleThemeChange = (key) => {
        if (themes[key]) {
            setTheme(themes[key]);
        } else {
            console.error(`Theme ${key} does not exist.`);
        }
    };

    return (
        <div className="settings-container">
            <h2>Settings</h2>

            <div className="theme-selection">
                <h3>Select Your Theme:</h3>
                <div className="themes">
                    {themeKeys.map((key, index) => (
                        <div
                            key={index}
                            className="theme-option"
                            style={{ backgroundImage: themes[key]?.backgroundImage }}
                            onClick={() => handleThemeChange(key)}
                        />
                    ))}
                </div>
            </div>

            <div className="avatar-selection">
                <h3>Select Your Avatar:</h3>
                <div className="avatar-list">
                    {avatars.map((avatar, index) => (
                        <img
                            key={index}
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                            onClick={() => handleAvatarSelect(avatar)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Settings;
