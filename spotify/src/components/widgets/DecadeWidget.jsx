'use client';

import { useState } from 'react';
import '../style/DecadeWidget.css'

export default function DecadeWidget() {
  
  const decades = [
    '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'
  ];

 
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [startYear, setStartYear] = useState('');  
  const [endYear, setEndYear] = useState('');  


  const handleDecadeSelect = (decade) => {
    setSelectedDecades((prevSelected) => {
      if (prevSelected.includes(decade)) {
        return prevSelected.filter((item) => item !== decade);
      }
      return [...prevSelected, decade];
    });
  };

  
  const handleYearChange = (e) => {
    if (e.target.name === 'startYear') {
      setStartYear(e.target.value);
    } else if (e.target.name === 'endYear') {
      setEndYear(e.target.value);
    }
  };

  return (
    <div className="decade-widget">
      <h3>Elige década o rango de años</h3>

      
      <div className="decade-selector">
        <h4>Décadas</h4>
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

      
      <div className="year-range">
        <h4>Años</h4>
        <div className="year-inputs">
          <input
            type="number"
            name="startYear"
            value={startYear}
            onChange={handleYearChange}
            placeholder="Inicio"
            min="1900"
          />
          <span>-</span>
          <input
            type="number"
            name="endYear"
            value={endYear}
            onChange={handleYearChange}
            placeholder="Fin"
            min="1900"
          />
        </div>
      </div>

      
      <div className="selected-decades">
        <h4>Décadas seleccionadas:</h4>
        <ul>
          {selectedDecades.map((decade, index) => (
            <li key={index}>{decade}</li>
          ))}
        </ul>
        {startYear && endYear && (
          <p>Rango de años: {startYear} - {endYear}</p>
        )}
      </div>
    </div>
  );
}
