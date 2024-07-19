import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

const themes = {
    theme1: {
        backgroundImage: 'url(/images/yelloback.jpg)',
        navbarColor: '#f8f9fa',
        sidbarColor:'#f8f9fa'
    },
    theme2: {
        backgroundImage: 'url(/images/image2.png)',
        navbarColor: '#2d588a',
    },
    theme3: {
        backgroundImage: 'url(/images/image1.jpg)',
        navbarColor: '#e3ccd3'
    },
    theme4: {
        backgroundImage: 'url(/images/image4.png)',
        navbarColor: '#E2F7FF',
    },
    theme5: {
        backgroundImage: 'url(/images/image5.png)',
        navbarColor: '#81966C',
    },
    theme6: {
        backgroundImage: 'url(/images/image6.png)',
        navbarColor: '#0B1218',
    },
    theme7: {
        backgroundImage: 'url(/images/image7.png)',
        navbarColor: '#c3d0e8',
    },
    theme8: {
        backgroundImage: 'url(/images/image1.png)',
        navbarColor: '#28a745',
    }
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(themes.theme1);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};
