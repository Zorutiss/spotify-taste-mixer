'use client';

import { useState } from 'react';
import './DecadeWidget.css';  // Importamos el CSS para el widget

export default function DecadeWidget() {
  // Decadas disponibles
  const decades = [
    '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'
  ];

  // Estado para las décadas seleccionadas
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [startYear, setStartYear] = useState('');  // Año de inicio para el rango
  const [endYear, setEndYear] = useState('');    // Año de fin para el rango

  // Manejar la selección de una década
  const handleDecadeSelect = (decade) => {
    setSelectedDecades((prevSelected) => {
      if (prevSelected.includes(decade)) {
        return prevSelected.filter((item) => item !== decade);
      }
      return [...prevSelected, decade];
    });
  };

  // Manejar el cambio de los años de rango
  const handleYearChange = (e) => {
    if (e.target.name === 'startYear') {
      setStartYear(e.target.value);
    } else if (e.target.name === 'endYear') {
      setEndYear(e.target.value);
    }
  };

  return (
    <div className="decade-widget">
      <h3>Select Your Favorite Decades or Enter a Year Range</h3>

      {/* Selector de décadas */}
      <div className="decade-selector">
        <h4>Select Decades</h4>
        <div className="decade-list">
          {decades.map((decade) => (
            <div
              key={decade}
              className={`decade-item ${selectedDecades.includes(decade) ? 'selected' : ''}`}
              onClick={() => handleDecadeSelect(decade)}
            >
              <span>{decade}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selector de rango de años */}
      <div className="year-range">
        <h4>Or Select a Year Range</h4>
        <div className="year-inputs">
          <input
            type="number"
            name="startYear"
            value={startYear}
            onChange={handleYearChange}
            placeholder="Start Year"
            min="1900"
          />
          <span>-</span>
          <input
            type="number"
            name="endYear"
            value={endYear}
            onChange={handleYearChange}
            placeholder="End Year"
            min="1900"
          />
        </div>
      </div>

      {/* Mostrar las décadas y rangos seleccionados */}
      <div className="selected-decades">
        <h4>Selected Decades:</h4>
        <ul>
          {selectedDecades.map((decade, index) => (
            <li key={index}>{decade}</li>
          ))}
        </ul>
        {startYear && endYear && (
          <p>Year Range: {startYear} - {endYear}</p>
        )}
      </div>
    </div>
  );
}
