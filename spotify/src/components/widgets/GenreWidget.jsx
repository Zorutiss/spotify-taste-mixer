'use client';

import { useEffect, useState } from 'react';
import '../style/GenreWidget.css';

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

  const filteredGenres = genres.filter((genre) =>
    genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="genre-widget">
      <h3>Elige tus géneros favoritos</h3>

      <input
        type="text"
        placeholder="Buscar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="genre-search"
      />

      <div className="genre-list">
        {filteredGenres.map((genre) => (
          <div
            key={genre}
            className={`genre-item ${selectedGenres.includes(genre) ? 'selected' : ''}`}
            onClick={() => handleGenreSelect(genre)}
          >
            <span>{genre}</span>
          </div>
        ))}
      </div>

      <div className="selected-genres">
        <h4>Seleccionados ({selectedGenres.length}/5)</h4>
        <ul>
          {selectedGenres.map((genre) => (
            <li key={genre}>{genre}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
