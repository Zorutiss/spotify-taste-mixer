'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/TrackWidget.css';

export default function TrackWidget({ accessToken }) {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const searchTracks = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await axios.get(`https://api.spotify.com/v1/search?type=track&q=${query}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTracks(response.data.tracks.items);
      setError(null);
    } catch (error) {
      setError('Error al obtener las canciones');
      console.error("Error fetching tracks:", error);
    } finally {
      setLoading(false);
    }
  };

 
  const handleTrackSelect = (trackId) => {
    setSelectedTracks((prevSelected) => {
      if (prevSelected.includes(trackId)) {
        return prevSelected.filter((id) => id !== trackId);
      }
      return [...prevSelected, trackId]; 
    });
  };

  
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
          <p>No se han encontrado canciones</p>
        )}
      </ul>

      <div>
        <h3>Canciones elegidas:</h3>
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
