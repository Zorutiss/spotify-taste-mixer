'use client';

import { useMemo, useState } from 'react';


function clampInt(x, min, max, fallback) {
  const n = Number(x);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function parseYear(releaseDate) {
  if (!releaseDate) return null;
  const y = Number(String(releaseDate).slice(0, 4));
  return Number.isFinite(y) ? y : null;
}

function uniqById(tracks) {
  const seen = new Set();
  const out = [];
  for (const t of tracks) {
    if (!t?.id || seen.has(t.id)) continue;
    seen.add(t.id);
    out.push(t);
  }
  return out;
}

function buildSeeds({ selectedArtists, selectedGenres }) {
  return {
    seed_artists: (Array.isArray(selectedArtists) ? selectedArtists : []).slice(0, 5),
    seed_genres: (Array.isArray(selectedGenres) ? selectedGenres : []).slice(0, 5),
  };
}

function decadeToYearRange(selectedDecades) {
  return {
    startYear: Number.isFinite(selectedDecades?.startYear) ? selectedDecades.startYear : null,
    endYear: Number.isFinite(selectedDecades?.endYear) ? selectedDecades.endYear : null,
  };
}

async function spotifyFetch(url, accessToken, options = {}) {
  const method = options.method || 'GET';
  const headers = { Authorization: `Bearer ${accessToken}` };
  if (method !== 'GET') headers['Content-Type'] = 'application/json';

  const res = await fetch(url, { ...options, method, headers });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch {}

  if (!res.ok) {
    console.error('Spotify error:', res.status, text);
    throw new Error(data?.error?.message || `Spotify error ${res.status}`);
  }
  return data ?? {};
}


export default function PlaylistWidget({
  accessToken,
  selectedArtists,
  selectedGenres,
  selectedMood,
  selectedDecades,
  selectedPopularity,
}) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);

  const seeds = useMemo(
    () => buildSeeds({ selectedArtists, selectedGenres }),
    [selectedArtists, selectedGenres]
  );

  const decadeInfo = useMemo(
    () => decadeToYearRange(selectedDecades),
    [selectedDecades]
  );

  const popularity = useMemo(
    () => clampInt(selectedPopularity ?? 50, 0, 100, 50),
    [selectedPopularity]
  );

  const totalSeeds = seeds.seed_artists.length + seeds.seed_genres.length;


  const filterTracks = (tracks) => {
    const minP = Math.max(0, popularity - 20);
    const maxP = Math.min(100, popularity + 20);

    return tracks.filter((t) => {
      if (t.popularity < minP || t.popularity > maxP) return false;
      if (decadeInfo.startYear && decadeInfo.endYear) {
        const y = parseYear(t.album?.release_date);
        if (y && (y < decadeInfo.startYear || y > decadeInfo.endYear)) return false;
      }
      return true;
    });
  };

  const handlePreview = async () => {
    try {
      setError(null);
      setCreated(null);

      if (!accessToken) return setError('No hay sesión de Spotify.');
      if (totalSeeds === 0) return setError('Selecciona al menos un artista o género.');

      setLoading(true);

      const me = await spotifyFetch('https://api.spotify.com/v1/me', accessToken);
      const market = me?.country || 'ES';

      let all = [];

      for (const id of seeds.seed_artists) {
        const d = await spotifyFetch(
          `https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}`,
          accessToken
        );
        all.push(...(d.tracks ?? []));
      }

      for (const genre of seeds.seed_genres) {
        const q = `genre:"${genre}"`;
        const d = await spotifyFetch(
          `https://api.spotify.com/v1/search?type=track&limit=50&market=${market}&q=${encodeURIComponent(q)}`,
          accessToken
        );
        all.push(...(d.tracks?.items ?? []));
      }

      const unique = uniqById(all);
      const filtered = filterTracks(unique);
      setPreview((filtered.length ? filtered : unique).slice(0, 25));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setError(null);
      if (!preview.length) return setError('Primero genera una previsualización.');

      setLoading(true);

      const me = await spotifyFetch('https://api.spotify.com/v1/me', accessToken);

      const name = `Taste Mixer · ${selectedMood?.mood || 'Custom'}`;

      const playlist = await spotifyFetch(
        `https://api.spotify.com/v1/users/${me.id}/playlists`,
        accessToken,
        {
          method: 'POST',
          body: JSON.stringify({
            name,
            public: false,
            description: 'Playlist privada generada con Spotify Taste Mixer',
          }),
        }
      );

      const uris = preview.map((t) => t.uri);
      await spotifyFetch(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        accessToken,
        { method: 'POST', body: JSON.stringify({ uris }) }
      );

      setCreated({ name, url: playlist.external_urls.spotify, count: uris.length });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-white">Playlist</h3>

      <div className="text-sm text-white/70 space-y-1">
        <div>Seeds: {totalSeeds}</div>
        <div>Popularidad objetivo: {popularity}</div>
        {decadeInfo.startYear && <div>Años: {decadeInfo.startYear}–{decadeInfo.endYear}</div>}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handlePreview}
          disabled={loading}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400 disabled:opacity-40"
        >
          {loading ? 'Generando…' : 'Previsualizar'}
        </button>

        <button
          onClick={handleCreate}
          disabled={loading || preview.length === 0}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700 disabled:opacity-40"
        >
          Crear playlist privada
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-200 ring-1 ring-red-500/20">
          {error}
        </div>
      )}

      {created && (
        <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-300 ring-1 ring-emerald-500/20">
          Playlist creada: <strong>{created.name}</strong> ({created.count} canciones) ·{' '}
          <a href={created.url} target="_blank" className="underline">Abrir</a>
        </div>
      )}

      {preview.length > 0 && (
        <div className="max-h-72 overflow-y-auto rounded-xl bg-zinc-950/40 ring-1 ring-white/10 p-3">
          <h4 className="mb-2 text-sm font-medium text-white">
            Preview ({preview.length})
          </h4>
          <ul className="space-y-2 text-sm">
            {preview.map((t) => (
              <li key={t.id}>
                <strong>{t.name}</strong>{' '}
                <span className="text-white/60">
                  — {t.artists.map((a) => a.name).join(', ')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
