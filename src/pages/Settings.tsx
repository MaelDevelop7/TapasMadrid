import React, { useEffect, useState } from "react";
import './Settings.css';
import { useNavigate }  from 'react-router-dom';
import {versionTag} from '../components/credits'
import Header from '../components/Header';

const Settings: React.FC = () => {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('darkMode') === 'true'
  );
  const goHome = () => {
      navigate('/')
   }
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle("dark-mode", newMode);
  };
  

  const handleResetLocalData = () => {
    const confirmReset = window.confirm("¿Estás seguro de que quieres borrar los datos locales?");
    if (confirmReset) {
      localStorage.clear();
      alert("Datos locales eliminados.");
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <div className="settings-page">
      <Header />
      <h2>⚙️ Ajustes</h2>

      <div className="setting">
        <label>
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          Modo oscuro
        </label>
      </div>

      <div className="setting">
        <button onClick={handleResetLocalData}>🧹 Borrar datos locales</button>
       
        
      </div>
      <button onClick={goHome}>Ir a inicio</button>
      <div className="setting small">
        <p>Versión: {versionTag}</p>
      </div>
    </div>
  );
};

export default Settings;
