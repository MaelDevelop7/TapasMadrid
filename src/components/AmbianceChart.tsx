import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import './Chart.css';

// Enregistrement des composants nécessaires de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
    votes: Record<string, number>;
};

// Emojis associés aux types d’ambiance
const emojiMap: Record<string, string> = {
    calma: "😴",
    musicá: "🎶",
    ambiante: "🍻",
    fiesta: "🎉",
    lleno: "🕺",
};

// Fonction utilitaire pour majusculer la première lettre
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const AmbianceChart: React.FC<Props> = ({ votes }) => {
    const labels = Object.keys(votes);
    const dataValues = Object.values(votes);

    if (labels.length === 0) {
        return <p style={{ textAlign: 'center' }}>Aucun vote pour le moment.</p>;
    }

    const data = {
        labels: labels.map((label) => `${emojiMap[label] || ''} ${capitalize(label)}`),
        datasets: [
            {
                label: 'Votes',
                data: dataValues,
                backgroundColor: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ff4d4f'],
                borderWidth: 1,
            }
        ],
    };

    return (
        <div className="chart-container">
            <Pie data={data} />
        </div>
    );
};

export default AmbianceChart;
