import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store';
import App from './App';
import './index.css';

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.classList.toggle('dark', savedTheme === 'dark');
document.documentElement.classList.toggle('light', savedTheme === 'light');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);