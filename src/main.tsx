import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AudioProvider } from './context/AudioContext';
import { NotesProvider } from './context/NotesContext';

import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AudioProvider>
      <NotesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotesProvider>
    </AudioProvider>
  </React.StrictMode>
);
