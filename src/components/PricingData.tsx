import React from "react";

const pricingData = [
  {
    level: "Free",
    price: "0 €",
    benefits: [
      "Accès limité",
      "1 vote cada 30 minutos",
      "Publicités",
    ],
  },
  {
    level: "Premium",
    price: "5 € / mes",
    benefits: [
      "Accès complet",
      "5 votes cada 30 minutos",
      "Sans publicités",
      "Support prioritaire",
    ],
  },
  {
    level: "VIP",
    price: "10,00 € / mes",
    benefits: [
      "Accès illimité",
      "10 votes cada 30 minutos",
      "Sans publicités",
      "Support premium 24/7",
      "Fonctionnalités exclusives",
    ],
  },
];

const SubscriptionPricing: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Tarifs des abonnements</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#eee" }}>
            <th style={{ border: "1px solid #ccc", padding: 10 }}>Abonnement</th>
            <th style={{ border: "1px solid #ccc", padding: 10 }}>Prix</th>
            <th style={{ border: "1px solid #ccc", padding: 10 }}>Avantages</th>
          </tr>
        </thead>
        <tbody>
          {pricingData.map(({ level, price, benefits }) => (
            <tr key={level}>
              <td style={{ border: "1px solid #ccc", padding: 10, fontWeight: "bold" }}>
                {level}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 10 }}>{price}</td>
              <td style={{ border: "1px solid #ccc", padding: 10 }}>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionPricing;
