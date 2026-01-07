'use client';

import { useEffect, useMemo, useState } from 'react';

export default function PopularityWidget({ updatePopularity }) {
  const [popularity, setPopularity] = useState(50);

  useEffect(() => {
    if (typeof updatePopularity === 'function') {
      updatePopularity(Number(popularity));
    }

  }, [popularity]); 

  const category = useMemo(() => {
    const p = Number(popularity);
    if (p >= 80) return 'Mainstream (80-100)';
    if (p >= 50) return 'Popular (50-80)';
    return 'Underground (0-50)';
  }, [popularity]);

  const hint = useMemo(() => {
    if (Number(popularity) >= 80) return 'Canciones muy conocidas y actuales.';
    if (Number(popularity) >= 50) return 'Mezcla equilibrada entre conocidas y no tanto.';
    return 'Más descubrimiento: menos mainstream.';
  }, [popularity]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-white">Popularidad</h3>
        <p className="text-sm text-white/60">
          Ajusta lo “mainstream” que quieres que sea la playlist.
        </p>
      </div>

      <div className="rounded-xl bg-zinc-950/40 ring-1 ring-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-white">Popularidad</label>
          <span className="text-sm font-semibold text-white/80 tabular-nums">{popularity}</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={popularity}
          onChange={(e) => setPopularity(e.target.value)}
          className="mt-3 w-full accent-emerald-500"
        />

        <div className="mt-2 flex justify-between text-[11px] text-white/40">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="inline-flex w-fit items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
          {category}
        </span>
        <span className="text-sm text-white/60">{hint}</span>
      </div>

      <p className="text-sm text-white/50">
        Cuanta más popularidad, más famosa se considera la canción.
      </p>
    </div>
  );
}
