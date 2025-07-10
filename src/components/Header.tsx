import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <>
            <div className="app-header">
                <h1>🍻 Tapas Radar</h1>
                <nav>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/mapa">Mapa</Link></li>
                        <li><Link to="/settings">Ajustes</Link></li>
                        <li><Link to="/about">Sobre nosotros</Link></li>
                        <li><Link to="/abonnement">Abonnement</Link></li>
                    </ul>
                </nav>
            </div>


        </>
    );
};


export default Header;
