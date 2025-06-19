import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import './Bar.css';

type Commentaire = {
  nom: string;
  message: string;
  rating: number;
  timestamp?: any;
};

const renderStarsFromNote = (note: number) => {
  const fullStars = Math.floor(note);
  const hasHalfStar = note - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} className="star active">★</span>);
  }

  if (hasHalfStar) {
    stars.push(<span key="half" className="star half">★</span>);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="star">★</span>);
  }

  return stars;
};

const Bar: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [nom, setNom] = useState('');
  const [comments, setComments] = useState<Commentaire[]>([]);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchBar = async () => {
      const ref = doc(db, 'bars', id!);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setNom(snap.data().nom);
      }
    };

    const q = query(collection(db, `bars/${id}/comments`), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coms = snapshot.docs.map(doc => doc.data() as Commentaire);
      setComments(coms);
    });

    fetchBar();
    return () => unsubscribe();
  }, [id]);

  const moyenne = comments.length
    ? (comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(1)
    : 'Sin valoraciones';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || rating === 0) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      await addDoc(collection(db, `bars/${id}/comments`), {
        uid: user?.uid || "anon",
        nom: "Anónimo",
        message,
        rating,
        timestamp: serverTimestamp()
      });
      setMessage('');
      setRating(0);
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      alert("Hubo un problema al enviar el comentario.");
    }
  };

  return (
    <div className="bar-page">
      <h2>{nom}</h2>
      <div className="rating">
        <span className="label">Nota media:</span>
        {typeof moyenne === 'string' ? (
          <span> {moyenne}</span>
        ) : (
          <>
            {renderStarsFromNote(parseFloat(moyenne))}
            <span style={{ marginLeft: '0.5rem' }}>({moyenne} / 5)</span>
            <span style={{ marginLeft: '0.5rem', fontSize: '1rem' }}>
              • {comments.length} {comments.length === 1 ? 'comentario' : 'comentarios'}
            </span>
          </>
        )}
      </div>

      <h3>Comentarios:</h3>
      <ul>
        {comments.map((c, i) => (
          <li key={i}>
            <strong>{c.nom}</strong> – ⭐ {c.rating}<br />
            {c.message}
          </li>
        ))}
      </ul>

      <h3>Añadir comentario:</h3>
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          placeholder="Escribe tu comentario..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setRating(n)}
              className={n <= rating ? 'star active' : 'star'}
            >
              ★
            </span>
          ))}
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Bar;
