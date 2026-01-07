'use client';

import { useEffect, useState } from 'react';

export default function GenreWidget({ updateGenres }) {
  const genres = [
    'acoustic','afrobeat','alt-rock','alternative','ambient','anime','black-metal','bluegrass',
    'blues','bossanova','brazil','breakbeat','british','cantopop','chicago-house','children',
    'chill','classical','club','comedy','country','dance','dancehall','death-metal','deep-house',
    'detroit-techno','disco','disney','drum-and-bass','dub','dubstep','edm','electro','electronic',
    'emo','folk','forro','french','funk','garage','german','gospel','goth','grindcore','groove',
    'grunge','guitar','happy','hard-rock','hardcore','hardstyle','heavy-metal','hip-hop','house',
    'idm','indian','indie','indie-pop','industrial','iranian','j-dance','j-idol','j-pop','j-rock',
    'jazz','k-pop','kids','latin','latino','malay','mandopop','metal','metal-misc','metalcore',
    'minimal-techno','movies','mpb','new-age','new-release','opera','pagode','party','philippines-opm',
    'piano','pop','pop-film','post-dubstep','power-pop','progressive-house','psych-rock','punk',
    'punk-rock','r-n-b','rainy-day','reggae','reggaeton','road-trip','rock','rock-n-roll','rockabilly',
    'romance','sad','salsa','samba','sertanejo','show-tunes','singer-songwriter','ska','sleep',
    'songwriter','soul','soundtracks','spanish','study','summer','swedish','synth-pop','tango',
    'techno','trance','trip-hop','turkish','work-out','world-music'
  ];

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (typeof updateGenres === 'function') {
      updateGenres(selectedGenres);
    }
  }, [selectedGenres, updateGenres]);

  const handleGenreSelect = (genre) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) return prev.filter((g) => g !== genre);
      if (prev.length >= 5) return prev;
      return [...prev, genre];
    });
  };

  const filteredGenres = genres.filter((g) =>
    g.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Elige tus géneros
        </h3>
        <p className="text-sm text-white/60">
          Máximo 5 · usados para generar la playlist
        </p>
      </div>

      <input
        type="text"
        placeholder="Buscar género…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-white/40
                   ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <div className="max-h-48 overflow-y-auto rounded-lg bg-zinc-950/40 p-2 ring-1 ring-white/10">
        <div className="flex flex-wrap gap-2">
          {filteredGenres.map((genre) => {
            const selected = selectedGenres.includes(genre);
            return (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreSelect(genre)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition
                  ${
                    selected
                      ? 'bg-emerald-500 text-black'
                      : 'bg-zinc-800 text-white/80 hover:bg-zinc-700'
                  }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-white">
          Seleccionados ({selectedGenres.length}/5)
        </h4>

        {selectedGenres.length === 0 ? (
          <p className="text-sm text-white/40">Ninguno seleccionado</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedGenres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
