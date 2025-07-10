import React from 'react';
import './About.css';
import Header from '../components/Header';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <Header />
      <h1>ℹ️ Sobre nosotros</h1>
      <p>
        Tapas Radar es una aplicación que te permite encontrar los mejores bares de Madrid según su ambiente, en tiempo real. Vota el ambiente, descubre los lugares más animados y participa en la comunidad.
      </p>

      <h2 style={{ marginTop: '2rem' }}>💳 Tarifs & Abonnements</h2>
      <div className="pricing-table">
        <div className="plan">
          <h3>Free</h3>
          <p><strong>0 € / mes</strong></p>
          <ul>
            <li>✅ 1 voto chaque 30 minutes</li>
            <li>✅ Accès à la carte en direct</li>
            <li>❌ Aucun badge</li>
          </ul>
        </div>
        <div className="plan">
          <h3>Premium</h3>
          <p><strong>2,49 € / mois</strong></p>
          <ul>
            <li>✅ 3 votes chaque 30 minutes</li>
            <li>✅ Badge Premium</li>
            <li>✅ Accès plus rapide</li>
          </ul>
        </div>
        <div className="plan">
          <h3>VIP</h3>
          <p><strong>4,99 € / mois</strong></p>
          <ul>
            <li>✅ Votes illimités</li>
            <li>✅ Badge VIP doré</li>
            <li>✅ Accès anticipé aux nouveautés</li>
            <li>✅ Soutien au développement</li>
          </ul>
        </div>
      </div>

      <p style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.9rem' }}>
        Tous les paiements sont sécurisés via Stripe. Vous pouvez annuler à tout moment.
      </p>

      <h2 style={{ marginTop: '3rem' }}>❓ Preguntas frecuentes (FAQ)</h2>

      <div className="faq-section">
        <div className="faq-item">
          <h3>🧭 ¿Qué es TapasRadar?</h3>
          <p>Una app que muestra el ambiente actual de los bares, basada en los votos de los usuarios. Te ayuda a decidir dónde salir.</p>
        </div>

        <div className="faq-item">
          <h3>🗳️ ¿Cómo funcionan los votos?</h3>
          <p>Cada usuario puede votar una vez cada 30 minutos. Los usuarios Premium o VIP tienen más votos disponibles por hora.</p>
        </div>

        <div className="faq-item">
          <h3>🏅 ¿Qué beneficios tienen los planes Premium y VIP?</h3>
          <ul>
            <li><strong>Premium:</strong> Más votos por hora, acceso anticipado a nuevas funciones.</li>
            <li><strong>VIP:</strong> Votos illimitados, badge doré, priorización en nuevas funcionalidades.</li>
          </ul>
        </div>

        <div className="faq-item">
          <h3>🆓 ¿La app es gratuita?</h3>
          <p>Sí. Puedes consultar la información de los bares sin pagar. Solo los extras como los votos adicionales requieren una suscripción.</p>
        </div>

        <div className="faq-item">
          <h3>📍 ¿Dónde funciona TapasRadar?</h3>
          <p>Actualmente en Madrid, pero planeamos expandirnos a otras ciudades con la ayuda de la comunidad.</p>
        </div>

        <div className="faq-item">
          <h3>🔒 ¿Qué pasa con mis datos?</h3>
          <p>No compartimos ni vendemos tus datos. Todo se queda en Firebase, en servidores seguros.</p>
        </div>
      </div>

      <p style={{ marginTop: '3rem' }}>
        Creado por: <a href="https://github.com/maeldevelop7" target="_blank" rel="noopener noreferrer">Mael Gruand</a>
      </p>
    </div>
  );
};

export default About;
