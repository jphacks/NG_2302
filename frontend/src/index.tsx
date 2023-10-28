import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import App from './App';

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

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={ theme } >
        <CssBaseline />
        < App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
