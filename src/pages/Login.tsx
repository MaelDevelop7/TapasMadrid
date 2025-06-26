import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  linkWithPopup,
  linkWithCredential,
  EmailAuthProvider,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const auth = getAuth();

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleUserInFirestore = async (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email || null,
        subscriptionStatus: 'free',
        subscriptionStart: null,
        subscriptionEnd: null,
        createdAt: new Date(),
        pseudo: user.email ? user.email.split('@')[0] : 'anónimo',
      });
    }
  };

  async function linkAnonymousWithGoogle(user: User) {
    const provider = new GoogleAuthProvider();
    try {
      const result = await linkWithPopup(user, provider);
      return result.user;
    } catch (error: any) {
      if (error.code === 'auth/credential-already-in-use') {
        const result = await signInWithPopup(auth, provider);
        try {
          if (auth.currentUser?.isAnonymous) {
            await auth.currentUser.delete();
          }
        } catch (e) {
          console.warn('Erreur lors de la suppression de l’utilisateur anonyme', e);
        }
        return result.user;
      }
      throw error;
    }
  }

  async function linkAnonymousWithEmail(user: User, email: string, password: string) {
    const credential = EmailAuthProvider.credential(email, password);
    try {
      const result = await linkWithCredential(user, credential);
      return result.user;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        try {
          if (auth.currentUser?.isAnonymous) {
            await auth.currentUser.delete();
          }
        } catch (e) {
          console.warn('Erreur lors de la suppression de l’utilisateur anonyme', e);
        }
        return result.user;
      }
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await handleUserInFirestore(firebaseUser);
        setLoading(false);
      } else {
        try {
          await signInAnonymously(auth);
        } catch {
          setError('Error en la conexión anónima');
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.isAnonymous) {
        const linkedUser = await linkAnonymousWithGoogle(currentUser);
        await handleUserInFirestore(linkedUser);
        setUser(linkedUser);
      } else {
        const result = await signInWithPopup(auth, new GoogleAuthProvider());
        await handleUserInFirestore(result.user);
        setUser(result.user);
      }
      navigate(from);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async () => {
    setError(null);
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.isAnonymous) {
        const linkedUser = await linkAnonymousWithEmail(currentUser, email, password);
        await handleUserInFirestore(linkedUser);
        setUser(linkedUser);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
          await handleUserInFirestore(auth.currentUser);
          setUser(auth.currentUser);
        }
      }
      navigate(from);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async () => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await handleUserInFirestore(userCredential.user);
      setUser(userCredential.user);
      navigate(from);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Acceder a TapasMadrid</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={loginWithGoogle} style={{ width: '100%', marginBottom: 10 }}>
        Iniciar sesión con Google
      </button>

      <hr />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', marginTop: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', marginTop: 10, padding: 8 }}
      />

      <button onClick={loginWithEmail} style={{ width: '100%', marginTop: 10 }}>
        Iniciar sesión
      </button>

      <button onClick={registerWithEmail} style={{ width: '100%', marginTop: 10 }}>
        Crear cuenta
      </button>
    </div>
  );
};

export default Login;
