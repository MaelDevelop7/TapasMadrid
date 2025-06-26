import React, { useEffect, useState } from "react";
import './Settings.css';
import { useNavigate } from 'react-router-dom';
import { versionTag } from '../components/credits';
import Header from '../components/Header';
import { getAuth, signOut } from 'firebase/auth';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('darkMode') === 'true'
  );
  const [pseudo, setPseudo] = useState('');
  const [saved, setSaved] = useState(false);

  const goHome = () => {
    navigate('/');
  };

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      alert('Error al cerrar sesión: ' + (error as Error).message);
    }
  };

  const handleSavePseudo = async () => {
    if (!auth.currentUser || !pseudo.trim()) return;
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, { pseudo });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    // Charger le pseudo existant au démarrage
    const fetchPseudo = async () => {
      if (!auth.currentUser) return;
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setPseudo(docSnap.data().pseudo || '');
      }
    };
    fetchPseudo();
  }, [auth.currentUser]);

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
        <label>
          Nombre público:
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>
        <button onClick={handleSavePseudo} style={{ marginLeft: 8 }}>Guardar</button>
        {saved && <span style={{ color: 'green', marginLeft: 10 }}>✔️ Guardado</span>}
      </div>

      <div className="setting">
        <button onClick={handleResetLocalData}>🧹 Borrar datos locales</button>
      </div>

      <div className="setting">
        <button onClick={handleLogout} style={{ backgroundColor: '#e53e3e', color: 'white' }}>
          🔒 Cerrar sesión
        </button>
      </div>

      <button onClick={goHome}>Ir a inicio</button>

      <div className="setting small">
        <p>Versión: {versionTag}</p>
      </div>
    </div>
  );
};

export default Settings;
