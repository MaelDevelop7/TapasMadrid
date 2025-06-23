import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'
import mas from '../assets/añadir.png';
import settingsIcon from '../assets/settings.png';
import Header from '../components/Header';
const Home: React.FC = () => {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/mapa')
  }
  const handleAdd = () => {
    navigate('/añadir')
  }
  const handleSett = () => {
    navigate('/settings')
  } 

  return (
    <div className="home">
      <Header />
      
      <p className="description">
        Descubre los bares con más ambiente de Madrid en tiempo real. Tapas, cerveza y buena vibra — todo en un vistazo.
      </p>
      <button className="start-button" onClick={handleStart}>
        Empezar
      </button>
      <br />
      <button className='start-button' onClick={handleAdd}><img src={mas} alt="icon +" /></button>
      <button className='goSetting' onClick={handleSett}><img src={settingsIcon} alt="settings" /></button>
    </div>
  )
}

export default Home
