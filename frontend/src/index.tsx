import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CookiesProvider } from 'react-cookie';
import App from './App';
import { ModeProvider } from './contexts/ModeContexts';

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
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <CookiesProvider>
                    <ModeProvider>
                        < App />
                    </ModeProvider>
                </CookiesProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
