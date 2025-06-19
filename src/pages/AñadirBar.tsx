import React, { useState } from "react";
import { useBars } from "../hooks/useBars";
import { useNavigate } from "react-router-dom";
import "./AñadirBar.css";
import { toast } from 'react-toastify';

const AñadirBar: React.FC = () => {
  const [nom, setNom] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [resetting, setResetting] = useState(false); // ✅ Déclaré au niveau du composant

  const { ajouterBar } = useBars();
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !lat || !lng) return alert("Por favor, completa todos los campos.");

    try {
      await ajouterBar({ nom, lat: parseFloat(lat), lng: parseFloat(lng) });
      navigate("/mapa");
      toast.success("Formulario enviado correctamente ✅");
    } catch (error) {
      console.error("Error al añadir bar:", error);
      alert("Hubo un error al guardar el bar.");
    }
  };

  const handleReset = () => {
    const confirmReset = window.confirm("¿Estás seguro de que quieres borrar el formulario?");
    if (!confirmReset) return;

    setResetting(true);
    setTimeout(() => {
      setNom('');
      setLat('');
      setLng('');
      setResetting(false);
      toast.info("Formulario limpiado correctamente ✅");
    }, 300);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del bar"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className={resetting ? 'resetting' : ''}
        />
        <input
          type="number"
          placeholder="Latitud"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className={resetting ? 'resetting' : ''}
        />
        <input
          type="number"
          placeholder="Longitud"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className={resetting ? 'resetting' : ''}
        />
        <button type="submit">Guardar</button>
        <button type="button" onClick={handleReset}>Resetear</button>
        <button type="button" onClick={handleHome}>Ir a inicio</button>
      </form>
    </div>
  );
};

export default AñadirBar;
