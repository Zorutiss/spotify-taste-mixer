'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './TrackWidget.css';

export default function TrackWidget({ accessToken }) {
  const [query, setQuery] = useState('');  // Estado para la consulta de búsqueda
  const [tracks, setTracks] = useState([]);  // Estado para las canciones encontradas
  const [selectedTracks, setSelectedTracks] = useState([]);  // Estado para las canciones seleccionadas
  const [loading, setLoading] = useState(false);  // Estado de carga
  const [error, setError] = useState(null);  // Estado de error

  // Función para manejar la búsqueda de canciones
  const searchTracks = async () => {
    if (!query) return;  // No hacer búsqueda si la consulta está vacía

    setLoading(true);  // Iniciar carga
    try {
      const response = await axios.get(`https://api.spotify.com/v1/search?type=track&q=${query}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTracks(response.data.tracks.items);  // Guardar los resultados de la búsqueda
      setError(null);  // Limpiar cualquier error anterior
    } catch (error) {
      setError('Error al obtener las canciones');
      console.error("Error fetching tracks:", error);
    } finally {
      setLoading(false);  // Terminar carga
    }
  };

  // Función para manejar la selección de canciones
  const handleTrackSelect = (trackId) => {
    setSelectedTracks((prevSelected) => {
      if (prevSelected.includes(trackId)) {
        return prevSelected.filter((id) => id !== trackId);  // Desmarcar la canción si ya está seleccionada
      }
      return [...prevSelected, trackId];  // Agregar la canción a las seleccionadas
    });
  };

  // Ejecutar la búsqueda cuando cambia la consulta
  useEffect(() => {
    if (query) {
      searchTracks();
    }
  }, [query]);

  return (
    <div className="widget">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar canciones..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}  // Actualizar la consulta de búsqueda
        />
      </div>

      {loading && <p>Loading tracks...</p>}
      {error && <p>{error}</p>}

      <ul>
        {tracks.length > 0 ? (
          tracks.map((track) => (
            <li
              key={track.id}
              onClick={() => handleTrackSelect(track.id)}
              className={`track-item ${selectedTracks.includes(track.id) ? 'selected' : ''}`}
            >
              <img src={track.album.images[0]?.url} alt={track.name} width={50} />
              <div>
                <p>{track.name}</p>
                <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
              </div>
            </li>
          ))
        ) : (
          <p>No tracks found.</p>
        )}
      </ul>

      <div>
        <h3>Selected Tracks:</h3>
        <ul>
          {selectedTracks.map((trackId) => {
            const track = tracks.find((track) => track.id === trackId);
            return track ? (
              <li key={trackId}>
                {track.name} - {track.artists.map((artist) => artist.name).join(', ')}
              </li>
            ) : null;
          })}
        </ul>
      </div>
    </div>
  );
}
