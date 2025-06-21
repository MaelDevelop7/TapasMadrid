import React, { useEffect, useState } from "react";
import './Settings.css';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('darkMode') === 'true'
  );

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

      <div className="setting small">
        <p>Versión: 1.0.0</p>
      </div>
    </div>
  );
};

export default Settings;
