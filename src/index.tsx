import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {dark} from "@mui/material/styles/createPalette";
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        ...dark,
    },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
);

