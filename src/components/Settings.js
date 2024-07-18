import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import './Settings.css';

// Assurez-vous que les chemins des images sont corrects
const themes = [
    { name: 'Theme 1', backgroundImage: 'url(/images/image1.jpg)' },
    { name: 'Theme 2', backgroundImage: 'url(/images/image2.png)' },
    { name: 'Theme 3', backgroundImage: 'url(/images/image3.png)' },
    { name: 'Theme 4', backgroundImage: 'url(/images/image4.jpg)' },
    { name: 'Theme 5', backgroundImage: 'url(/images/image5.jpg)' },
];

const Settings = () => {
    const { setTheme } = useContext(ThemeContext);

    return (
        <div className="settings-container">
            <h2>Choose a Theme</h2>
            <div className="themes">
                {themes.map((theme, index) => (
                    <div
                        key={index}
                        className="theme-option"
                        style={{ backgroundImage: theme.backgroundImage }}
                        onClick={() => setTheme(theme.backgroundImage)}
                    >
                        {theme.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
