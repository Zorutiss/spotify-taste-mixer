'use client'; 
import { useState, useEffect } from "react";
import axios from "axios";


export default function ArtistWidget({ accessToken }) {
  const [artists, setArtists] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);  

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (accessToken && isClient) {
      const fetchArtists = async () => {
        try {
          setLoading(true); 
          const response = await axios.get("https://api.spotify.com/v1/me/top/artists", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          
          console.log("Respuesta de Spotify:", response.data);

          
          if (response && response.data && response.data.items && response.data.items.length > 0) {
            setArtists(response.data.items);
          } else {
            setError('No se encontraron artistas en tu lista de "Top Artists".');
          }
        } catch (error) {
          setError('Error al obtener artistas: ' + error.message);
          console.error("Error fetching artists:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchArtists();
    }
  }, [accessToken, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="widget">
      {loading ? (
        <p>Loading artists...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {artists.length > 0 ? (
            artists.map((artist) => (
              <li key={artist.id}>
                <img src={artist.images[0]?.url} alt={artist.name} width={50} />
                <span>{artist.name}</span>
              </li>
            ))
          ) : (
            <p>No top artists found.</p>
          )}
        </ul>
      )}
    </div>
  );
}
