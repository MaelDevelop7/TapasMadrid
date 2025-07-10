import React, { useEffect, useState } from "react";
import './Settings.css';
import { useNavigate } from 'react-router-dom';
import { versionTag } from '../components/credits';
import Header from '../components/Header';
import { getAuth, signOut } from 'firebase/auth';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { VOTE_LIMIT_MINUTES, VOTE_LIMITS_BY_SUBSCRIPTION } from '../config';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('darkMode') === 'true'
  );
  const [pseudo, setPseudo] = useState('');
  const [subscription, setSubscription] = useState('free'); // état abonnement
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
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPseudo(data.pseudo || '');
        // IMPORTANT : récupère subscriptionStatus (clé exacte dans ta base)
        setSubscription(data.subscriptionStatus || 'free');
      }
    };
    fetchUserData();
  }, [auth.currentUser]);

  const maxVotes = VOTE_LIMITS_BY_SUBSCRIPTION[subscription] ?? 1;

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
            className="pseudo-input"
          />
        </label>
        <button className="save-button" onClick={handleSavePseudo}>Guardar</button>
        {saved && <span className="save-success">✔️ Guardado</span>}
      </div>

      <div className="setting">
        <p className="vote-limit">
          🗳️ Límite de voto de ambiente: {maxVotes} voto(s) cada {VOTE_LIMIT_MINUTES} minutos (plan {subscription})
        </p>
      </div>

      <div className="setting">
        <button onClick={handleResetLocalData}>🧹 Borrar datos locales</button>
      </div>

      <div className="setting">
        <button className="logout-button" onClick={handleLogout}>
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
