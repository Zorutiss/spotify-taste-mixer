'use client';

import { useEffect, useState } from 'react';
import '../style/PopularityWidget.css';

export default function PopularityWidget({ updatePopularity }) {
  const [popularity, setPopularity] = useState(50);

  // Enviar al dashboard cuando cambie
  useEffect(() => {
    if (typeof updatePopularity === 'function') {
      updatePopularity(Number(popularity));
    }
  }, [popularity]); // <- importante: sin updatePopularity aquí

  const getCategory = () => {
    const p = Number(popularity);
    if (p >= 80) return 'Mainstream (80-100)';
    if (p >= 50) return 'Popular (50-80)';
    return 'Underground (0-50)';
  };

  return (
    <div className="popularity-widget">
      <h3>Selecciona popularidad</h3>

      <div className="slider-container">
        <label>Popularidad: {popularity}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={popularity}
          onChange={(e) => setPopularity(e.target.value)}
        />
      </div>

      <div className="category">
        <p>{getCategory()}</p>
      </div>

      <div className="description">
        <p>
          Cuanta más popularidad, más famosa se considera la canción.
          Elige una categoría que se ajuste a lo que buscas:
        </p>
      </div>
    </div>
  );
}
