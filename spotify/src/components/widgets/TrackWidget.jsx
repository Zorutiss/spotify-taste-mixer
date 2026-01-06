'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../style/TrackWidget.css';

export default function TrackWidget({ accessToken, selectedTracks, updateSelectedTracks }) {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Evitar spamear la API en cada tecla
  const debounceRef = useRef(null);

  const searchTracks = async (q) => {
    if (!q?.trim()) {
      setTracks([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { type: 'track', q, limit: 20 },
      });

      setTracks(response.data.tracks.items);
      setError(null);
    } catch (e) {
      setError('Error al obtener las canciones');
      console.error('Error fetching tracks:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSelect = (trackId) => {
    if (typeof updateSelectedTracks !== 'function') return;

    updateSelectedTracks((prev) => {
      // soporta que prev sea array (tu caso actual)
      const arr = Array.isArray(prev) ? prev : [];
      if (arr.includes(trackId)) return arr.filter((id) => id !== trackId);
      return [...arr, trackId];
    });
  };

  // Debounce de búsqueda
  useEffect(() => {
    if (!accessToken) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      searchTracks(query);
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [query, accessToken]);

  const selected = Array.isArray(selectedTracks) ? selectedTracks : [];

  return (
    <div className="widget">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar canciones..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
              className={`track-item ${selected.includes(track.id) ? 'selected' : ''}`}
            >
              <img src={track.album.images[0]?.url} alt={track.name} width={50} />
              <div>
                <p>{track.name}</p>
                <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
              </div>
            </li>
          ))
        ) : (
          query ? <p>No se han encontrado canciones</p> : <p>Escribe para buscar canciones</p>
        )}
      </ul>

      <div>
        <h3>Canciones elegidas:</h3>
        <ul>
          {selected.map((trackId) => {
            const track = tracks.find((t) => t.id === trackId);
            return (
              <li key={trackId}>
                {track ? (
                  <>
                    {track.name} - {track.artists.map((a) => a.name).join(', ')}
                  </>
                ) : (
                  <>Track ID: {trackId}</>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
