import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

const themes = {
    default: {
        backgroundImage: 'url(/images/yelloback.jpg)',
        navbarColor: '#f8f9fa', // couleur navbar par défaut
    },
    theme1: {
        backgroundImage: 'url(/images/image1.jpg)',
        navbarColor: '#f8f9fa' , // couleur navbar pour le thème 1
    },
    theme2: {
        backgroundImage: 'url(/images/image2.png)',
        navbarColor: '#0038ff', // couleur navbar pour le thème 2
    },
    theme3: {
        backgroundImage: 'url(/images/image4.png)',
        navbarColor: '#007bff', // couleur navbar pour le thème 3
    },
    theme4: {
        backgroundImage: 'url(/images/image5.png)',
        navbarColor: '#6c757d', // couleur navbar pour le thème 4
    },
    theme5: {
        backgroundImage: 'url(/images/image6.png)',
        navbarColor: '#28a745', // couleur navbar pour le thème 5
    },
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(themes.default);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};
