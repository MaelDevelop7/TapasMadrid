import React from 'react';
import Header from '../components/Header';
import './Tapeo.css';

import { useNavigate } from 'react-router-dom';


const Tapeo: React.FC = () => {
    const navigate = useNavigate()
  return (
    <div className="tapeo-page">
      <Header />
      <div className="content">
        <h2>¿Qué es el Tapeo?</h2>
        <p>
          El <strong>tapeo</strong> es una costumbre muy española que consiste en ir de bar en bar,
          probando diferentes <em>tapas</em> mientras se disfruta de una bebida (cerveza, vino, vermut…).
        </p>

        <h3>¿Qué son las tapas?</h3>
        <p>
          Las tapas son pequeñas raciones de comida que se sirven junto a la bebida. En Madrid, muchas veces
          son <strong>gratuitas</strong> con tu consumición. Algunas tapas típicas son:
        </p>
        <ul>
          <li>🥔 Patatas bravas</li>
          <li>🐙 Pulpo a la gallega</li>
          <li>🥖 Bocadillo de calamares</li>
          <li>🧆 Croquetas caseras</li>
          <li>🧀 Queso manchego</li>
        </ul>

        <h3>Consejos para disfrutar del tapeo</h3>
        <ul>
          <li>⏰ Ve entre las 13h–15h o entre las 20h–22h.</li>
          <li>📍 Algunos barrios perfectos: La Latina, Lavapiés, Malasaña.</li>
          <li>💶 Lleva algo de efectivo: algunos bares no aceptan tarjeta.</li>
          <li>👥 Lo ideal es ir en grupo y compartir las tapas.</li>
        </ul>

        <h3>Eventos recomendados</h3>
        <p>
          Cada año se celebra <strong>Tapapiés</strong>, un festival de tapas y música en el barrio de Lavapiés.
          ¡No te lo pierdas!
        </p>

        <button onClick={() => navigate("/mapa")}>Ver mapa de bares 🗺️</button>
      </div>
    </div>
  );
};

export default Tapeo;
