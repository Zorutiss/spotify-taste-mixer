'use client';

import { useState } from 'react';
import './PopularityWidget.css';

export default function PopularityWidget() {

  const [popularity, setPopularity] = useState(50);
  
  
  const handlePopularityChange = (e) => setPopularity(e.target.value);

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
      <h3>Choose Popularity</h3>

 
      <div className="slider-container">
        <label>Popularity: {popularity}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={popularity}
          onChange={handlePopularityChange}
        />
      </div>

 
      <div className="category">
        <p>Category: {getCategory()}</p>
      </div>

    
      <div className="description">
        <p>
          Cuanta más pupularidad, más famosa se considera la canción.
          Elige una categoría que se ajuste a tí:
        </p>
      </div>
    </div>
  );
}
