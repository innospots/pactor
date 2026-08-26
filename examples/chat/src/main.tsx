import 'katex/dist/katex.min.css';
import 'pactor-ui/styles.css';
import 'pactor-chat/styles.css';
import './app.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
