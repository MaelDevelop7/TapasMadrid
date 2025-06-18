import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const Home: React.FC = () => {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/mapa')
  }

  return (
    <div className="home">
      <h1 className="title">🍻 TapasRadar</h1>
      <p className="description">
        Descubre los bares con más ambiente de Madrid en tiempo real. Tapas, cerveza y buena vibra — todo en un vistazo.
      </p>
      <button className="start-button" onClick={handleStart}>
        Empezar
      </button>
    </div>
  )
}

export default Home
