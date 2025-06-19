import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { collection, getDocs, doc, getDocs as getSubDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import './Mapa.css';

type Bar = {
  id: string;
  nom: string;
  lat: number;
  lng: number;
  note?: number;
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const Mapa: React.FC = () => {
  const [bars, setBars] = useState<Bar[]>([]);
  const madrid: [number, number] = [40.4168, -3.7038];

  useEffect(() => {
    const fetchBars = async () => {
      const snapshot = await getDocs(collection(db, 'bars'));
      const barsData: Bar[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Omit<Bar, 'id'>;
        const commentsSnap = await getDocs(collection(db, `bars/${docSnap.id}/comments`));
        const comments = commentsSnap.docs.map(doc => doc.data() as { rating: number });

        const average =
          comments.length > 0
            ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
            : null;

        barsData.push({
          id: docSnap.id,
          nom: data.nom,
          lat: data.lat,
          lng: data.lng,
          note: average ?? null,
        });
      }

      setBars(barsData);
    };

    fetchBars();
  }, []);

  return (
    <div className="container">
      <h2 className="title">Mapa de bares en Madrid</h2>
      <div className="map">
        <MapContainer center={madrid} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {bars.map((bar) => (
            <Marker position={[bar.lat, bar.lng]} key={bar.id}>
              <Popup>
                <strong>{bar.nom}</strong><br />
                {bar.note !== null
                  ? `⭐ ${bar.note.toFixed(1)} / 5`
                  : "Sin valoraciones"}
                <br />
                <Link to={`/bar/${bar.id}`}>Ver ficha</Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <Link to="/" className="back-link">
        Volver al inicio
      </Link>
    </div>
  );
};

export default Mapa;
