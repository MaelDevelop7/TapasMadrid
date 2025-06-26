import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const Abonnement: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState<"free" | "premium">("free");
  const [subscriptionEnd, setSubscriptionEnd] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const fetchSubscription = async () => {
        try {
          setLoadingSub(true);
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.subscriptionEnd && data.subscriptionEnd.toDate) {
              const endDate = data.subscriptionEnd.toDate();
              setSubscriptionEnd(endDate);
              if (endDate > new Date()) {
                setSubscriptionStatus(data.subscriptionStatus || "free");
              } else {
                await updateDoc(userRef, {
                  subscriptionStatus: "free",
                  subscriptionEnd: null,
                  subscriptionStart: null,
                });
                setSubscriptionStatus("free");
                setSubscriptionEnd(null);
              }
            } else {
              setSubscriptionStatus(data.subscriptionStatus || "free");
              setSubscriptionEnd(null);
            }
          } else {
            setSubscriptionStatus("free");
            setSubscriptionEnd(null);
          }
        } catch (e: any) {
          setError("Error al recuperar la suscripción");
          console.error(e);
        } finally {
          setLoadingSub(false);
        }
      };

      fetchSubscription();
    }
  }, [loading, user]);

  const upgradeToPremium = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const now = new Date();
      const newEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días
      await updateDoc(userRef, {
        subscriptionStatus: "premium",
        subscriptionStart: now,
        subscriptionEnd: newEnd,
      });
      setSubscriptionStatus("premium");
      setSubscriptionEnd(newEnd);
      setError(null);
    } catch (e: any) {
      setError("Error al actualizar la suscripción");
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const downgradeToFree = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        subscriptionStatus: "free",
        subscriptionStart: null,
        subscriptionEnd: null,
      });
      setSubscriptionStatus("free");
      setSubscriptionEnd(null);
      setError(null);
    } catch (e: any) {
      setError("Error al actualizar la suscripción");
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  if (loading || loadingSub) return <div>Cargando...</div>;
  if (!user) return <div>Usuario no conectado.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Suscripción del usuario</h1>
      <p>UID: {user.uid}</p>
      <p>
        Estado: <strong>{subscriptionStatus.toUpperCase()}</strong>
      </p>
      {subscriptionStatus === "premium" && subscriptionEnd && (
        <p>Fecha de expiración: {subscriptionEnd.toLocaleDateString()}</p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {subscriptionStatus === "free" && (
        <button onClick={upgradeToPremium} disabled={processing}>
          {processing ? "Procesando..." : "Pasar a Premium (30 días)"}
        </button>
      )}

      {subscriptionStatus === "premium" && (
        <button onClick={downgradeToFree} disabled={processing} style={{ marginTop: 10 }}>
          {processing ? "Procesando..." : "Volver a estado Free"}
        </button>
      )}

      <button
        onClick={() => navigate("/")}
        style={{ marginTop: 20, display: "block" }}
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default Abonnement;
