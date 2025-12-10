'use client';

import { useState } from 'react';
import '../style/PopularityWidget.css';

export default function PopularityWidget() {

  //Guardamos el valor de popularidad de canciones
  const [popularity, setPopularity] = useState(50);
  
  //Cambio en el deslizador
  const handlePopularityChange = (e) => setPopularity(e.target.value);

  //Establecemos la popularidad en base al número
  const getCategory = () => {
    if (popularity >= 80) {
      return 'Mainstream (80-100)';
    } else if (popularity >= 50) {
      return 'Popular (50-80)';
    } else {
      return 'Underground (0-50)';
    }
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
          onChange={handlePopularityChange}
        />
      </div>

 
      <div className="category">
        <p>{getCategory()}</p>
      </div>

    
      <div className="description">
        <p>
          Cuanta más pupularidad, más famosa se considera la canción.
          Elige una categoría que se ajuste a lo que buscas:
        </p>
      </div>
    </div>
  );
}
