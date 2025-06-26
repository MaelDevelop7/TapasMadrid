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
        setLoading(false);
      } else {
        // Pas d’utilisateur connecté, alors on essaie la connexion anonyme
        signInAnonymously(auth)
          .then((cred) => {
            setUser({
              uid: cred.user.uid,
              isAnonymous: true,
            });
            setLoading(false);
          })
          .catch((error) => {
            console.error("Erreur lors de la connexion anonyme", error);
            setUser(null);
            setLoading(false);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
