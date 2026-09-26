import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx';     // ✅ Sửa lại import này
import "./index.css";

const rootElement = document.getElementById('root')!;
ReactDOM.createRoot(rootElement).render(
 <React.StrictMode>
    <App />
  </React.StrictMode>
);
