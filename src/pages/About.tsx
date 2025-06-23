import React from 'react';
import './About.css';
import Header from '../components/Header';

const About: React.FC = () => {
    return (
        <div className="about-page">
            <Header />
            <h1>Sobre nosotros</h1>
            <p>Tapas Radar es una aplicación que te permite encontrar los mejores bares de Madrid.</p>
            <p>By: <a href="https://github.com/maeldevelop7">Mael Gruand</a></p>       
        </div>
    );
};

export default About;
