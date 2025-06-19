import React from 'react';
import { credits } from './credits';
import './Footer.css';


const Footer: React.FC = () =>{
    return(
        <div className="footer">
            <p className="credits">&copy; {credits}</p>
        </div>
    )
}

export default Footer;
