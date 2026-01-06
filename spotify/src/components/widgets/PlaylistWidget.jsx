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
    const id = t?.id;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(t);
  }
  return out;
}

function buildSeeds({ selectedArtists, selectedGenres }) {
  const artists = Array.isArray(selectedArtists) ? selectedArtists.filter(Boolean) : [];
  const genres = Array.isArray(selectedGenres) ? selectedGenres.filter(Boolean) : [];
  return { seed_artists: artists.slice(0, 5), seed_genres: genres.slice(0, 5) };
}

function decadeToYearRange(selectedDecades) {
  const d = selectedDecades || {};
  const startYear = Number.isFinite(d.startYear) ? d.startYear : null;
  const endYear = Number.isFinite(d.endYear) ? d.endYear : null;
  return { startYear, endYear };
}

async function spotifyFetch(url, accessToken, options = {}) {
  const method = options.method || 'GET';

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    ...(options.headers || {}),
  };

  if (method !== 'GET' && method !== 'HEAD') {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, { ...options, method, headers });

  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch {}

  if (!res.ok) {
    console.log('SPOTIFY ERROR URL:', url);
    console.log('SPOTIFY STATUS:', res.status);
    console.log('SPOTIFY BODY:', text);
    throw new Error(data?.error?.message || `Spotify error: ${res.status}`);
  }

  return data ?? {};
}

export default function PlaylistWidget({
  accessToken,
  selectedArtists,
  selectedGenres,
  selectedTracks,      
  selectedMood,       
  selectedDecades,
  selectedPopularity,
}) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState(null);
  const [createdPlaylist, setCreatedPlaylist] = useState(null);

  const seeds = useMemo(
    () => buildSeeds({ selectedArtists, selectedGenres }),
    [selectedArtists, selectedGenres]
  );

  const decadeInfo = useMemo(() => decadeToYearRange(selectedDecades), [selectedDecades]);

  const popularity = useMemo(
    () => clampInt(selectedPopularity ?? 50, 0, 100, 50),
    [selectedPopularity]
  );

  const summary = useMemo(() => {
    const totalSeeds = seeds.seed_artists.length + seeds.seed_genres.length;
    return { totalSeeds, seeds, popularity, decadeInfo };
  }, [seeds, popularity, decadeInfo]);

  const filterTracks = (tracks) => {
    const { startYear, endYear } = decadeInfo;

    return tracks.filter((t) => {
      const p = Number(t?.popularity ?? 50);
      const minP = Math.max(0, popularity - 20);
      const maxP = Math.min(100, popularity + 20);
      if (p < minP || p > maxP) return false;

      if (startYear && endYear) {
        const y = parseYear(t?.album?.release_date);
        if (y && (y < startYear || y > endYear)) return false;
      }
      return true;
    });
  };

  const fetchArtistTopTracks = async (artistId, market) => {
    const url = `https://api.spotify.com/v1/artists/${encodeURIComponent(artistId)}/top-tracks?market=${encodeURIComponent(market)}`;
    const data = await spotifyFetch(url, accessToken);
    return Array.isArray(data.tracks) ? data.tracks : [];
  };

  const searchTracksByGenre = async (genre, market, startYear, endYear) => {
    const yearPart = startYear && endYear ? ` year:${startYear}-${endYear}` : '';
    const q = `genre:"${genre}"${yearPart}`;

    const url = new URL('https://api.spotify.com/v1/search');
    url.searchParams.set('type', 'track');
    url.searchParams.set('limit', '50');
    url.searchParams.set('market', market);
    url.searchParams.set('q', q);

    const data = await spotifyFetch(url.toString(), accessToken);
    return Array.isArray(data?.tracks?.items) ? data.tracks.items : [];
  };

  const handlePreview = async () => {
    try {
      setError(null);
      setCreatedPlaylist(null);

      if (!accessToken) {
        setError('No hay accessToken. Vuelve a iniciar sesión.');
        return;
      }

      if (summary.totalSeeds === 0) {
        setError('Selecciona al menos 1 artista o 1 género (en esta versión no usamos /recommendations).');
        return;
      }

      setLoading(true);

      const me = await spotifyFetch('https://api.spotify.com/v1/me', accessToken);
      const market = me?.country || 'ES';

      const all = [];

      for (const artistId of seeds.seed_artists) {
        const top = await fetchArtistTopTracks(artistId, market);
        all.push(...top);
      }

      for (const genre of seeds.seed_genres) {
        const found = await searchTracksByGenre(
          genre,
          market,
          decadeInfo.startYear,
          decadeInfo.endYear
        );
        all.push(...found);
      }

      const unique = uniqById(all);
      const filtered = filterTracks(unique);

      const finalList = (filtered.length >= 15 ? filtered : unique).slice(0, 25);

      setPreview(finalList);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      setError(null);
      setCreatedPlaylist(null);

      if (!accessToken) {
        setError('No hay accessToken. Vuelve a iniciar sesión.');
        return;
      }

      if (preview.length === 0) {
        setError('Primero genera una previsualización.');
        return;
      }

      setLoading(true);

      const me = await spotifyFetch('https://api.spotify.com/v1/me', accessToken);
      const userId = me?.id;
      if (!userId) throw new Error('No se pudo obtener el usuario (me.id).');

      const nameParts = [];
      if (selectedMood?.mood) nameParts.push(selectedMood.mood);
      if (Array.isArray(selectedGenres) && selectedGenres.length) nameParts.push(selectedGenres[0]);
      const playlistName = `Taste Mixer · ${nameParts.join(' · ') || 'Custom'}`;

      const playlist = await spotifyFetch(
        `https://api.spotify.com/v1/users/${encodeURIComponent(userId)}/playlists`,
        accessToken,
        {
          method: 'POST',
          body: JSON.stringify({
            name: playlistName,
            description: 'Playlist privada generada con Spotify Taste Mixer',
            public: false,
          }),
        }
      );

      const playlistId = playlist?.id;
      const playlistUrl = playlist?.external_urls?.spotify || null;
      if (!playlistId) throw new Error('No se pudo crear la playlist (playlist.id).');

      const uris = preview.map((t) => t?.uri).filter(Boolean);

      for (let i = 0; i < uris.length; i += 100) {
        const chunk = uris.slice(i, i + 100);
        await spotifyFetch(
          `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks`,
          accessToken,
          { method: 'POST', body: JSON.stringify({ uris: chunk }) }
        );
      }

      setCreatedPlaylist({ url: playlistUrl, name: playlistName, count: uris.length });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Playlist</h3>

      <div style={{ opacity: 0.85, fontSize: 14 }}>
        <div>Seeds (artistas+géneros): {summary.totalSeeds}</div>
        <div>Artistas: {seeds.seed_artists.length} · Géneros: {seeds.seed_genres.length}</div>
        <div>Popularity target: {popularity}</div>
        {decadeInfo.startYear && decadeInfo.endYear && (
          <div>Años: {decadeInfo.startYear} - {decadeInfo.endYear}</div>
        )}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={handlePreview} disabled={loading}>
          {loading ? 'Cargando...' : 'Previsualizar canciones'}
        </button>

        <button onClick={handleCreatePlaylist} disabled={loading || preview.length === 0}>
          Crear playlist privada en Spotify
        </button>
      </div>

      {error && <p style={{ marginTop: 12 }}>{error}</p>}

      {createdPlaylist && (
        <p style={{ marginTop: 12 }}>
          Playlist privada creada<strong>{createdPlaylist.name}</strong> ({createdPlaylist.count} canciones) —{' '}
          <a href={createdPlaylist.url} target="_blank" rel="noreferrer">
            Abrir en Spotify
          </a>
        </p>
      )}

      {preview.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <h4>Preview ({preview.length})</h4>
          <ul>
            {preview.map((t) => (
              <li key={t.id} style={{ marginBottom: 8 }}>
                <strong>{t.name}</strong>{' '}
                <span style={{ opacity: 0.85 }}>
                  — {t.artists?.map((a) => a.name).join(', ')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
