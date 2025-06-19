// src/App.tsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import 'leaflet/dist/leaflet.css';
// pages
import Home from './pages/Home';
import Mapa from './pages/Mapa';
import AñadirBar from "./pages/AñadirBar";
// hooks
import { useAuth } from "./hooks/useAuth";

// components
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';


const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>Problema con la autenticación</p>;
  console.log(`Conectado anónimamente con UID ${user.uid}`)

  return (
    <>
      
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/añadir" element={<AñadirBar />} />
        </Routes>
        <Footer />
        <ToastContainer />
      </Router>
    
    </>
  )
}

export default App
