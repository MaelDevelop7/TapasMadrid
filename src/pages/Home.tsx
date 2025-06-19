import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const Home: React.FC = () => {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/mapa')
  }
  const handleAdd = () => {
    navigate('/añadir')
  }

  return (
    <div className="home">
      <h1 className="title">🍻 Tapas Radar</h1>
      <p className="description">
        Descubre los bares con más ambiente de Madrid en tiempo real. Tapas, cerveza y buena vibra — todo en un vistazo.
      </p>
      <button className="start-button" onClick={handleStart}>
        Empezar
      </button>
      <br />
      <button className='start-button' onClick={handleAdd}>Añadir bars</button>
      
    </div>
  )
}

export default Home
