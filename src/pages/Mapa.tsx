// src/pages/Mapa.tsx
import React from 'react'
import { Link } from 'react-router-dom'

const Mapa: React.FC = () => {
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>Mapa de bares en Madrid</h2>
      <p>Aquí mostraremos la mapa con los bares.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  )
}

export default Mapa
