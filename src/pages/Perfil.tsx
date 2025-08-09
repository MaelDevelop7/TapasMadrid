import React, { useEffect, useState } from "react";
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { SubscriptionStatus } from "../types/SubscriptionStatus";
import { useNavigate } from "react-router-dom";

const Perfil: React.FC = () => {
  const [pseudo, setPseudo] = useState('');
  const [saved, setSaved] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>("free");
  const [subscriptionEnd, setSubscriptionEnd] = useState<Date | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;

      try {
        setLoadingSub(true);
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const end = data.subscriptionEnd?.toDate?.();
          if (end && end > new Date()) {
            setSubscriptionStatus(data.subscriptionStatus || "free");
            setSubscriptionEnd(end);
          } else {
            setSubscriptionStatus("free");
            setSubscriptionEnd(null);
          }

          // Pré-remplir le pseudo si disponible
          if (data.pseudo) setPseudo(data.pseudo);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoadingSub(false);
      }
    };

    fetchSubscription();
  }, [user]);
  const navigate = useNavigate()
  const handleSavePseudo = async () => {
    if (!user || !pseudo.trim()) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { pseudo });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user || loadingSub) return <div>Cargando perfil...</div>;

  return (
    <div className="perfil-page">
      <h1>Perfil</h1>

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

      <br /><br />

      <label><strong>Suscripción actual:</strong></label>
      <p>{subscriptionStatus.toUpperCase()}</p>
      {subscriptionEnd && (
        <p><strong>Válido hasta:</strong> {subscriptionEnd.toLocaleDateString()}</p>
      )}
      <button onClick={()=> {navigate('/')}}>Volver al inicio</button>
    </div>
  );
};

export default Perfil;
