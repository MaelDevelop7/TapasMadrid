import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import './Mapa.css';
import Header from '../components/Header';
import { Map as LeafletMap } from 'leaflet';

type Bar = {
  id: string;
  nom: string;
  lat: number;
  lng: number;
  note?: number;
};

// Icônes Leaflet par défaut
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Icône personnalisée pour l'utilisateur
const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
});

const Mapa: React.FC = () => {
  const [bars, setBars] = useState<Bar[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const madrid: [number, number] = [40.4168, -3.7038];

  // Récupération des bars
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

  // Géolocalisation utilisateur
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("La géolocalisation n'est pas disponible sur ce navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        console.error("Erreur de géolocalisation :", error);
      }
    );
  }, []);

  const handleRecenter = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 16);
    }
  };

  return (
    <div className="container">
      <Header />
      <h2 className="title">Mapa de bares en Madrid</h2>

      <div className="map">
        <MapContainer
          center={madrid}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Bars */}
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

          {/* Utilisateur */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <strong>Tu es aquí 📍</strong>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Bouton flottant global */}
      {userLocation && (
        <button
          onClick={handleRecenter}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            zIndex: 1000,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '10px 14px',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          📍 Me centrer
        </button>
      )}

      <Link to="/" className="back-link">
        Volver al inicio
      </Link>
    </div>
  );
};

export default Mapa;
