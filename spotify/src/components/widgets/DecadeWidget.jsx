'use client';

import { useEffect, useState } from 'react';

export default function DecadeWidget({ updateDecades }) {
  const decades = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

  const [selectedDecades, setSelectedDecades] = useState([]);
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');

  const handleDecadeSelect = (decade) => {
    setSelectedDecades((prev) => {
      if (prev.includes(decade)) return prev.filter((d) => d !== decade);
      return [...prev, decade];
    });
  };

  const handleYearChange = (e) => {
    if (e.target.name === 'startYear') setStartYear(e.target.value);
    if (e.target.name === 'endYear') setEndYear(e.target.value);
  };

  useEffect(() => {
    if (typeof updateDecades === 'function') {
      updateDecades({
        decades: selectedDecades,
        startYear: startYear ? Number(startYear) : null,
        endYear: endYear ? Number(endYear) : null,
      });
    }
  }, [selectedDecades, startYear, endYear]);

  const hasRange = Boolean(startYear && endYear);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-white">Décadas / Años</h3>
        <p className="text-sm text-white/60">
          Elige décadas y/o define un rango de años para filtrar.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium text-white">Décadas</h4>

        <div className="flex flex-wrap gap-2">
          {decades.map((decade) => {
            const selected = selectedDecades.includes(decade);

            return (
              <button
                key={decade}
                type="button"
                onClick={() => handleDecadeSelect(decade)}
                className={[
                  'rounded-full px-3 py-1 text-xs font-medium transition ring-1',
                  selected
                    ? 'bg-emerald-500 text-black ring-emerald-400/40'
                    : 'bg-zinc-800 text-white/80 ring-white/10 hover:bg-zinc-700',
                ].join(' ')}
              >
                {decade}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium text-white">Rango de años</h4>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <input
            type="number"
            name="startYear"
            value={startYear}
            onChange={handleYearChange}
            placeholder="Inicio"
            min="1900"
            className="w-full sm:w-32 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-white/40
                       ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="hidden sm:block text-white/40">—</div>

          <input
            type="number"
            name="endYear"
            value={endYear}
            onChange={handleYearChange}
            placeholder="Fin"
            min="1900"
            className="w-full sm:w-32 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-white/40
                       ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {hasRange && (
          <p className="text-xs text-white/60">
            Rango activo: <span className="text-white/80 font-semibold">{startYear}</span> –{' '}
            <span className="text-white/80 font-semibold">{endYear}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium text-white">Seleccionado</h4>

        {selectedDecades.length === 0 && !hasRange ? (
          <p className="text-sm text-white/40">No has seleccionado nada todavía.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedDecades.map((d) => (
              <span key={d} className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400">
                {d}
              </span>
            ))}

            {hasRange && (
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
                {startYear}–{endYear}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
