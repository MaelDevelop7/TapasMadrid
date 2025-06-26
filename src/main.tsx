import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // CSS global si tu veux en ajouter
import 'react-toastify/dist/ReactToastify.css';
import { registerSW } from 'virtual:pwa-register';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

registerSW({
  onNeedRefresh() {
    if (confirm('Nueva versión disponible. ¿Recargar la página?')) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log('TapasRadar está disponible sin conexión.');
  }
});
