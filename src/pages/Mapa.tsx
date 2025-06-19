import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import './Mapa.css'
import { db } from '../services/firebase'
import { collection, onSnapshot, query } from 'firebase/firestore'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
})

const madridPosition: [number, number] = [40.4168, -3.7038]

interface Bar {
  id: string
  nom: string
  lat: number
  lng: number
}

const Mapa: React.FC = () => {
  const [bars, setBars] = useState<Bar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'bars'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data()
        return {
          id: doc.id,
          nom: d.nom,
          lat: Number(d.lat), // conversion explicite en number
          lng: Number(d.lng),
        }
      })
      console.log('Bars récupérés :', data)
      setBars(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="container">
      <h2 className="title">Mapa de bares en Madrid</h2>
      <div className="map">
        <MapContainer center={madridPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {!loading &&
            bars.map((bar) => (
              <Marker key={bar.id} position={[bar.lat, bar.lng]}>
                <Popup>{bar.nom}</Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
      <Link to="/" className="back-link">
        Volver al inicio
      </Link>
    </div>
  )
}

export default Mapa
