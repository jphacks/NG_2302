import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CookiesProvider } from 'react-cookie';
import App from './App';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Cloud FireStore用初期化
const firebaseConfig = {
    apiKey: "AIzaSyCsLRoJ6iB-gKx-_x3vCHq4kLoQigtljsU",
    authDomain: "dj-hukkin-56d10.firebaseapp.com",
    projectId: "dj-hukkin-56d10",
    storageBucket: "dj-hukkin-56d10.appspot.com",
    messagingSenderId: "544721830185",
    appId: "1:544721830185:web:fd49eaa0cb778283cfb738",
    measurementId: "G-0GCDV92R7S"
}
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const theme = createTheme({
    palette: {
        common: {
            black: '#000',
            white: '#fffffe',
        },
        primary: {
            main: '#b8c1ec',
        },
        secondary: {
            main: '#eebbc3',
        },
        tertiary: {
            main: '#121629',
        },
        text: {
            primary: '#fffffe',
        },
        background: {
            default: '#232946',
        }
    },
});

declare module "@mui/material/styles" {
    interface PaletteOptions {
        tertiary: PaletteOptions["primary"];
    }
}

declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        tertiary: true;
    }
}

const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);
root.render(
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <CookiesProvider>
                <App />
            </CookiesProvider>
        </ThemeProvider>
    </BrowserRouter>
)
