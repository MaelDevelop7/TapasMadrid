import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  type User as FirebaseUser, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { db } from '../services/firebase'; // ta config firebase

// Type pour les données utilisateur que tu souhaites stocker
type UserData = {
  uid: string;
  email: string | null;
  subscriptionStatus: 'free' | 'premium';
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
};

type AuthContextType = {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = getAuth();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Charger les données Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            subscriptionStatus: data.subscriptionStatus ?? 'free',
            subscriptionStart: data.subscriptionStart ? data.subscriptionStart.toDate() : null,
            subscriptionEnd: data.subscriptionEnd ? data.subscriptionEnd.toDate() : null,
          });
        } else {
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setUserData(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
