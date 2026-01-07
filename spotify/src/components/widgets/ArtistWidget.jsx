'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const TIME_RANGES = ['short_term', 'medium_term', 'long_term'];

function rangeLabel(r) {
  if (r === 'long_term') return 'De siempre';
  return r;
}

export default function ArtistWidget({ accessToken, updateSelectedArtists }) {
  const [artists, setArtists] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usedRange, setUsedRange] = useState(null);

  const selectedArray = useMemo(() => Array.from(selectedIds), [selectedIds]);

  useEffect(() => {
    if (typeof updateSelectedArtists === 'function') {
      updateSelectedArtists(selectedArray);
    }
  }, [selectedArray]);

  useEffect(() => {
    if (!accessToken) return;

    //Búsqueda de artistas
    const fetchWithFallback = async () => {
      try {
        setLoading(true);
        setError(null);
        setArtists([]);
        setUsedRange(null);

        for (const time_range of TIME_RANGES) {
          const res = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit: 20, time_range },
          });

          const items = res?.data?.items ?? [];
          console.log('TOP ARTISTS', time_range, 'items:', items.length, res.data);

          if (items.length > 0) {
            setArtists(items);
            setUsedRange(time_range);
            return;
          }
        }

        setError(
          'Spotify no devuelve "Top Artists". Prueba a escuchar música un rato.'
        );
      } catch (err) {
        const status = err?.response?.status;
        const msg = err?.response?.data?.error?.message || err?.message || 'Error desconocido';

        if (status === 403) setError(`403 (scope insuficiente). Necesitas "user-top-read". Detalle: ${msg}`);
        else if (status === 401) setError(`401 (token inválido/expirado). Detalle: ${msg}`);
        else setError(`Error al obtener artistas: ${msg}`);

        console.log('Spotify error status:', status);
        console.log('Spotify error data:', err?.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchWithFallback();
  }, [accessToken]);


  const toggleArtist = (artistId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(artistId)) next.delete(artistId);
      else next.add(artistId);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Tus artistas top</h3>
        </div>

        <button
          type="button"
          onClick={clearSelection}
          disabled={selectedArray.length === 0}
          className="rounded-full px-3 py-1 text-xs font-medium
                     bg-zinc-800 text-white/80 hover:bg-zinc-700
                     disabled:opacity-40 disabled:hover:bg-zinc-800"
        >
          Limpiar
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-10 rounded-lg bg-zinc-800/60 animate-pulse" />
          <div className="h-10 rounded-lg bg-zinc-800/60 animate-pulse" />
          <div className="h-10 rounded-lg bg-zinc-800/60 animate-pulse" />
          <p className="text-sm text-white/50">Cargando artistas…</p>
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-3">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto rounded-xl bg-zinc-950/40 ring-1 ring-white/10">
          <ul className="divide-y divide-white/5">
            {artists.map((artist) => {
              const checked = selectedIds.has(artist.id);
              const img = artist.images?.[0]?.url;

              return (
                <li key={artist.id}>
                  <label
                    className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-white/5"
                    onClick={(e) => {
                      if (e.target?.tagName?.toLowerCase() === 'input') return;
                      toggleArtist(artist.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArtist(artist.id)}
                      className="h-4 w-4 accent-emerald-500"
                    />

                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-800 ring-1 ring-white/10">
                      {img ? (
                        <img src={img} alt={artist.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{artist.name}</p>
                      <p className="truncate text-xs text-white/50">
                        {artist.genres?.slice(0, 3)?.join(' · ') || '—'}
                      </p>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm text-white/70">
          Seleccionados: <span className="font-semibold text-white">{selectedArray.length}</span>
        </p>

        {selectedArray.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedArray.slice(0, 10).map((id) => (
              <span key={id} className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400">
                {id.slice(0, 8)}…
              </span>
            ))}
            {selectedArray.length > 10 && (
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-white/70">
                +{selectedArray.length - 10} más
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
