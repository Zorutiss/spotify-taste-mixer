'use client';
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const TIME_RANGES = ["short_term", "medium_term", "long_term"];

export default function ArtistWidget({ accessToken, updateSelectedArtists }) {
  const [artists, setArtists] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usedRange, setUsedRange] = useState(null);

  const selectedArray = useMemo(() => Array.from(selectedIds), [selectedIds]);

  useEffect(() => {
    if (typeof updateSelectedArtists === "function") {
      updateSelectedArtists(selectedArray);
    }
  }, [selectedArray, updateSelectedArtists]);

  useEffect(() => {
    if (!accessToken) return;

    const fetchWithFallback = async () => {
      try {
        setLoading(true);
        setError(null);
        setArtists([]);
        setUsedRange(null);

        for (const time_range of TIME_RANGES) {
          const res = await axios.get("https://api.spotify.com/v1/me/top/artists", {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit: 20, time_range },
          });

          const items = res?.data?.items ?? [];
          console.log("TOP ARTISTS", time_range, "items:", items.length, res.data);

          if (items.length > 0) {
            setArtists(items);
            setUsedRange(time_range);
            return;
          }
        }

        setError('Spotify no devuelve "Top Artists" en ningún rango (short/medium/long). Prueba a escuchar música un rato con la cuenta o usa otra fuente (p.ej. búsqueda manual).');
      } catch (err) {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.error?.message ||
          err?.message ||
          "Error desconocido";

        if (status === 403) {
          setError(`403 (scope insuficiente). Necesitas "user-top-read". Detalle: ${msg}`);
        } else if (status === 401) {
          setError(`401 (token inválido/expirado). Detalle: ${msg}`);
        } else {
          setError(`Error al obtener artistas: ${msg}`);
        }

        console.log("Spotify error status:", status);
        console.log("Spotify error data:", err?.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchWithFallback();
  }, [accessToken]);

  const toggleArtist = (artistId) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(artistId)) next.delete(artistId);
      else next.add(artistId);
      return next;
    });
  };

  return (
    <div className="widget">
      <h3>Top Artists</h3>

      {loading ? (
        <p>Loading artists...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {usedRange && (
            <p style={{ opacity: 0.8 }}>
              Fuente: me/top/artists ({usedRange})
            </p>
          )}
          <ul>
            {artists.map((artist) => {
              const checked = selectedIds.has(artist.id);
              return (
                <li
                  key={artist.id}
                  style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleArtist(artist.id)}
                  />
                  <img
                    src={artist.images?.[0]?.url}
                    alt={artist.name}
                    width={40}
                    height={40}
                  />
                  <span>{artist.name}</span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <p style={{ marginTop: 10 }}>
        Seleccionados: {selectedArray.length}
      </p>
    </div>
  );
}
