import { useEffect, useState } from "react";
import { auth, signInAnonymously, onAuthStateChanged } from "../services/firebase";

export interface User {
  uid: string;
  isAnonymous: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Essayer de connecter anonymement au démarrage
    signInAnonymously(auth).catch((error) => {
      console.error("Erreur lors de la connexion anonyme", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
