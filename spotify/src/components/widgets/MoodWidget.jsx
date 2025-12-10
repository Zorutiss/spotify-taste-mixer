'use client';

import { useState } from 'react';
import './MoodWidget.css';

export default function MoodWidget() {
  
  const [energy, setEnergy] = useState(50);
  const [valence, setValence] = useState(50);
  const [danceability, setDanceability] = useState(50);
  const [acousticness, setAcousticness] = useState(50);
  const [mood, setMood] = useState('Happy');

  
  const handleEnergyChange = (e) => setEnergy(e.target.value);
  const handleValenceChange = (e) => setValence(e.target.value);
  const handleDanceabilityChange = (e) => setDanceability(e.target.value);
  const handleAcousticnessChange = (e) => setAcousticness(e.target.value);

  
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
        <label>Relax: {valence}</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={valence} 
          onChange={handleValenceChange} 
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
        <label>Melódico: {acousticness}</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={acousticness} 
          onChange={handleAcousticnessChange} 
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
        <p>Relax: {valence}</p>
        <p>Bailongo: {danceability}</p>
        <p>Melódico: {acousticness}</p>
      </div>
    </div>
  );
}
