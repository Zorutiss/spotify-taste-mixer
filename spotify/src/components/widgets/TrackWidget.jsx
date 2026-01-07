'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function TrackWidget({ accessToken, selectedTracks, updateSelectedTracks }) {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);

  const selected = Array.isArray(selectedTracks) ? selectedTracks : [];

  const searchTracks = async (q) => {
    const qq = q?.trim();
    if (!qq) {
      setTracks([]);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { type: 'track', q: qq, limit: 20 },
      });

      setTracks(response?.data?.tracks?.items ?? []);
      setError(null);
    } catch (e) {
      setError('Error al obtener las canciones');
      console.error('Error fetching tracks:', e);
    } finally {
      setLoading(false);
    }
  };
  //Añadir y quitar canciones
  const handleTrackToggle = (trackId) => {
    if (typeof updateSelectedTracks !== 'function') return;

    updateSelectedTracks((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      if (arr.includes(trackId)) return arr.filter((id) => id !== trackId);
      return [...arr, trackId];
    });
  };

  const clearSelection = () => {
    if (typeof updateSelectedTracks !== 'function') return;
    updateSelectedTracks([]);
  };

  useEffect(() => {
    if (!accessToken) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchTracks(query), 250);

    return () => clearTimeout(debounceRef.current);
  }, [query, accessToken]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Buscar canciones</h3>
          <p className="text-sm text-white/60">Busca y selecciona tracks para usar como seed.</p>
        </div>

        <button
          type="button"
          onClick={clearSelection}
          disabled={selected.length === 0}
          className="rounded-full px-3 py-1 text-xs font-medium
                     bg-zinc-800 text-white/80 hover:bg-zinc-700
                     disabled:opacity-40 disabled:hover:bg-zinc-800"
        >
          Limpiar
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Buscar canciones…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-white/40
                     ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <div className="flex items-center justify-between text-xs text-white/50">
          <span>
            {query?.trim() ? `Resultados para: "${query.trim()}"` : ''}
          </span>
          <span>
            Seleccionadas:{' '}
            <span className="text-white/80 font-semibold">{selected.length}</span>
          </span>
        </div>
      </div>

      {loading && (
        <div className="space-y-2">
          <div className="h-12 rounded-xl bg-zinc-800/60 animate-pulse" />
          <div className="h-12 rounded-xl bg-zinc-800/60 animate-pulse" />
          <p className="text-sm text-white/50">Cargando tracks…</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-3">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="max-h-80 overflow-y-auto rounded-xl bg-zinc-950/40 ring-1 ring-white/10">
          {tracks.length > 0 ? (
            <ul className="divide-y divide-white/5">
              {tracks.map((track) => {
                const isSelected = selected.includes(track.id);
                const img = track?.album?.images?.[0]?.url;

                return (
                  <li key={track.id}>
                    <button
                      type="button"
                      onClick={() => handleTrackToggle(track.id)}
                      className={[
                        'w-full text-left flex items-center gap-3 px-3 py-2 transition',
                        'hover:bg-white/5',
                        isSelected ? 'bg-emerald-500/15' : '',
                      ].join(' ')}
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-800 ring-1 ring-white/10">
                        {img ? (
                          <img
                            src={img}
                            alt={track.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {track.name}
                        </p>
                        <p className="truncate text-xs text-white/50">
                          {track.artists?.map((a) => a.name).join(', ')}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <span
                          className={[
                            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                            isSelected
                              ? 'bg-emerald-500 text-black ring-emerald-400/40'
                              : 'bg-zinc-800 text-white/70 ring-white/10',
                          ].join(' ')}
                        >
                          {isSelected ? 'Añadida' : 'Añadir'}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            query?.trim() && (
              <div className="p-4 text-sm text-white/50">
                No se han encontrado canciones.
              </div>
            )
          )}
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-white">Canciones elegidas</h4>
        {selected.length === 0 ? (
          <p className="mt-1 text-sm text-white/40">Ninguna seleccionada</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {selected.slice(0, 12).map((id) => (
              <span
                key={id}
                className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400"
              >
                {id.slice(0, 8)}…
              </span>
            ))}
            {selected.length > 12 && (
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-white/70">
                +{selected.length - 12} más
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
