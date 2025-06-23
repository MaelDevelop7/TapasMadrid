import { useState } from 'react';
import { db } from '../services/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

export const useVote = (barId: string, uid: string) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const vote = async (type: string) => {
    setLoading(true);
    setError(null);

    try {
      const votesRef = collection(db, `bars/${barId}/ambianceVotes`);
      const thirtyMinutesAgo = Timestamp.fromDate(new Date(Date.now() - 30 * 60 * 1000));

      const q = query(
        votesRef,
        where('uid', '==', uid),
        where('timestamp', '>', thirtyMinutesAgo)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        setError('Ya has votado en los últimos 30 minutos.');
        return false;
      }

      await addDoc(votesRef, {
        uid,
        type,
        timestamp: Timestamp.now(),
      });

      return true;
    } catch (e) {
      console.error('Error al guardar el voto:', e);
      setError('Hubo un error al enviar tu voto.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { vote, loading, error };
};
