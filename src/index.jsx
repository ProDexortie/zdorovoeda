// Используем явный импорт из ESM CDN
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Обязательно укажите расширение .jsx

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App)
  )
);