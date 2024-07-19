import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import './Settings.css';

const themeKeys = ['theme1', 'theme2', 'theme3', 'theme4', 'theme5'];

const Settings = () => {
    const { setTheme, themes } = useContext(ThemeContext);

    const handleThemeChange = (key) => {
        setTheme(themes[key]);
    };

    return (
        <div className="settings-container">
            <h2>Choose a Theme</h2>
            <div className="themes">
                {themeKeys.map((key, index) => (
                    <div
                        key={index}
                        className="theme-option"
                        style={{ backgroundImage: themes[key].backgroundImage }}
                        onClick={() => handleThemeChange(key)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Settings;
