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
import { VOTE_LIMIT_MINUTES, VOTE_LIMITS_BY_SUBSCRIPTION } from '../config';

export const useVote = (
  barId: string,
  uid: string,
  subscriptionStatus: 'free' | 'premium' = 'free' // nouveau paramètre
) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const vote = async (type: string) => {
    setLoading(true);
    setError(null);

    try {
      const votesRef = collection(db, `bars/${barId}/ambianceVotes`);

      const voteLimitCount = VOTE_LIMITS_BY_SUBSCRIPTION[subscriptionStatus] || 1;
      const timeLimit = VOTE_LIMIT_MINUTES;

      const sinceTimestamp = Timestamp.fromDate(new Date(Date.now() - timeLimit * 60 * 1000));

      // Requête pour récupérer les votes récents de l'utilisateur
      const q = query(
        votesRef,
        where('uid', '==', uid),
        where('timestamp', '>', sinceTimestamp)
      );

      const snap = await getDocs(q);

      if (snap.size >= voteLimitCount) {
        setError(`Ya has votado el límite permitido (${voteLimitCount}) en los últimos ${timeLimit} minutos.`);
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
