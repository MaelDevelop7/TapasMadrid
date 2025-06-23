import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AmbianceChart from '../components/AmbianceChart';
import Header from '../components/Header';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { useVote } from '../hooks/useVote';
import './Bar.css';

type Comentario = {
  nom: string;
  message: string;
  rating: number;
  timestamp?: any;
};

const emojiMap: Record<string, string> = {
  calma: "😴",
  musica: "🎶",
  ambiente: "🍻",
  fiesta: "🎉",
  lleno: "🕺",
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Bar: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [votoDominante, setVotoDominante] = useState<string | null>(null);
  const [conteoVotos, setConteoVotos] = useState<Record<string, number>>({});

  const { vote, error: errorVoto, loading: cargandoVoto } = useVote(id!, user?.uid || "anon");

  useEffect(() => {
    const fetchBar = async () => {
      const ref = doc(db, 'bars', id!);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setNombre(snap.data().nom);
      }
    };

    const q = query(collection(db, `bars/${id}/comments`), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coms = snapshot.docs.map(doc => doc.data() as Comentario);
      setComentarios(coms);
    });

    fetchBar();
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const q = query(collection(db, `bars/${id}/ambianceVotes`));
    return onSnapshot(q, (snapshot) => {
      const nuevosConteos: Record<string, number> = {};
      snapshot.docs.forEach((doc) => {
        const tipo = doc.data().type;
        nuevosConteos[tipo] = (nuevosConteos[tipo] || 0) + 1;
      });

      setConteoVotos(nuevosConteos);
      const dominante = Object.entries(nuevosConteos).sort((a, b) => b[1] - a[1])[0]?.[0];
      setVotoDominante(dominante || null);
    });
  }, [id]);

  const promedio = comentarios.length
    ? (comentarios.reduce((acc, c) => acc + c.rating, 0) / comentarios.length).toFixed(1)
    : 'Sin valoraciones';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje || calificacion === 0) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      await addDoc(collection(db, `bars/${id}/comments`), {
        uid: user?.uid || "anon",
        nom: "Anónimo",
        message: mensaje,
        rating: calificacion,
        timestamp: serverTimestamp()
      });
      setMensaje('');
      setCalificacion(0);
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      alert("Hubo un problema al enviar el comentario.");
    }
  };

  const handleVote = async (tipo: string) => {
    const success = await vote(tipo);
    if (success) {
      alert("¡Gracias por tu voto!");
    } else if (errorVoto) {
      alert(errorVoto);
    }
  };

  const handleMap = () => {
    navigate("/mapa");
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

  return (
    <div className="bar-page">
      <Header />
      <h2>{nombre}</h2>

      {Object.keys(conteoVotos).length > 0 && (
        <>
          <h3 style={{ textAlign: 'center' }}>Distribución de votos de ambiente:</h3>
          <AmbianceChart votes={conteoVotos} />
        </>
      )}

      {votoDominante && (
        <div className="dominant-ambiance">
          Ambiente dominante: <span className={`tag tag-${votoDominante}`}>{emojiMap[votoDominante]} {capitalize(votoDominante)}</span>
        </div>
      )}

      <div className="rating">
        <span className="label">Calificación promedio:</span>
        {typeof promedio === 'string' ? (
          <span> {promedio}</span>
        ) : (
          <>
            {renderStarsFromNote(parseFloat(promedio))}
            <span style={{ marginLeft: '0.5rem' }}>({promedio} / 5)</span>
            <span style={{ marginLeft: '0.5rem', fontSize: '1rem' }}>
              • {comentarios.length} {comentarios.length === 1 ? 'comentario' : 'comentarios'}
            </span>
          </>
        )}
      </div>

      <h3>Comentarios:</h3>
      <ul>
        {comentarios.map((c, i) => (
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
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
        />

        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setCalificacion(n)}
              className={n <= calificacion ? 'star active' : 'star'}
            >
              ★
            </span>
          ))}
        </div>

        <button type="submit">Enviar</button>
      </form>

      <h3>Ambiente actual:</h3>
      <div className="ambiance-buttons">
        {["calma", "musica", "ambiente", "fiesta", "lleno"].map((tipo) => (
          <button key={tipo} onClick={() => handleVote(tipo)} disabled={cargandoVoto}>
            {emojiMap[tipo]} {capitalize(tipo)}
          </button>
        ))}
      </div>

      <button onClick={handleMap}> Ver 🗺️</button>
    </div>
  );
};

export default Bar;
