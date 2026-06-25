import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { generateCSSVariables } from '@toolbox/design-system/tokens';
import { AppRouter } from './app/router';

const style = document.createElement('style');
style.textContent = generateCSSVariables();
document.head.appendChild(style);

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
