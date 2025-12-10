'use client';

import { useState } from 'react';
import '../style/MoodWidget.css';

export default function MoodWidget() {
  //Valores que cambiará el usuario (empiezan en 50)
  const [energy, setEnergy] = useState(50);
  const [relax, setRelax] = useState(50);
  const [danceability, setDanceability] = useState(50);
  const [melody, setMelody] = useState(50);
  const [mood, setMood] = useState('Happy');

  //Cambios de los deslizadores
  const handleEnergyChange = (e) => setEnergy(e.target.value);
  const handleRelaxChange = (e) => setRelax(e.target.value);
  const handleDanceabilityChange = (e) => setDanceability(e.target.value);
  const handleMelodyChange = (e) => setMelody(e.target.value);

  //Cambio en el estado de ánimo
  const handleMoodChange = (e) => setMood(e.target.value);

  return (
    <div className="mood-widget">
      <h3>Ajusta tu música</h3>

      <div className="slider-container">
        <label>Energía: {energy}</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={energy} 
          onChange={handleEnergyChange} 
        />
      </div>

      <div className="slider-container">
        <label>Relax: {relax}</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={relax} 
          onChange={handleRelaxChange} 
        />
      </div>

      <div className="slider-container">
        <label>Bailongo: {danceability}</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={danceability} 
          onChange={handleDanceabilityChange} 
        />
      </div>

      <div className="slider-container">
        <label>Melódico: {melody}</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={melody} 
          onChange={handleMelodyChange} 
        />
      </div>

      <div className="mood-selection">
        <h4>Elige tu estado</h4>
        <select value={mood} onChange={handleMoodChange}>
          <option value="Happy">Feliz</option>
          <option value="Sad">Triste</option>
          <option value="Energetic">Enérgico</option>
          <option value="Calm">Calmado</option>
        </select>
      </div>

      <div className="mood-summary">
        <h4>Tus elecciones:</h4>
        <p>Estado: {mood}</p>
        <p>Energía: {energy}</p>
        <p>Relax: {relax}</p>
        <p>Bailongo: {danceability}</p>
        <p>Melódico: {melody}</p>
      </div>
    </div>
  );
}
