'use client';

import { useEffect, useState } from 'react';

function Slider({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-white">{label}</label>
        <span className="text-sm font-semibold text-white/80 tabular-nums">{value}</span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={onChange}
        className="w-full accent-emerald-500"
      />

      <div className="flex justify-between text-[11px] text-white/40">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}

export default function MoodWidget({ updateMood }) {
  const [energy, setEnergy] = useState(50);
  const [relax, setRelax] = useState(50);
  const [danceability, setDanceability] = useState(50);
  const [melody, setMelody] = useState(50);
  const [mood, setMood] = useState('Happy');

  useEffect(() => {
    if (typeof updateMood === 'function') {
      updateMood({
        mood,
        energy: Number(energy),
        relax: Number(relax),
        danceability: Number(danceability),
        melody: Number(melody),
      });
    }

  }, [mood, energy, relax, danceability, melody]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-semibold text-white">Ajusta tu música</h3>
        <p className="text-sm text-white/60">
          Define energía, relax y baile. Se usará como “perfil” de la playlist.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Slider label="Energía" value={energy} onChange={(e) => setEnergy(e.target.value)} />
        <Slider label="Relax" value={relax} onChange={(e) => setRelax(e.target.value)} />
        <Slider label="Bailongo" value={danceability} onChange={(e) => setDanceability(e.target.value)} />
        <Slider label="Melódico" value={melody} onChange={(e) => setMelody(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium text-white">Estado</h4>

        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white
                     ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="Happy">Feliz</option>
          <option value="Sad">Triste</option>
          <option value="Energetic">Enérgico</option>
          <option value="Calm">Calmado</option>
        </select>
      </div>

      <div className="rounded-xl bg-zinc-950/40 ring-1 ring-white/10 p-4">
        <h4 className="text-sm font-semibold text-white">Resumen</h4>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-white/70">
          <div>Estado: <span className="text-white/90 font-semibold">{mood}</span></div>
          <div>Energía: <span className="text-white/90 font-semibold tabular-nums">{energy}</span></div>
          <div>Relax: <span className="text-white/90 font-semibold tabular-nums">{relax}</span></div>
          <div>Bailongo: <span className="text-white/90 font-semibold tabular-nums">{danceability}</span></div>
          <div>Melódico: <span className="text-white/90 font-semibold tabular-nums">{melody}</span></div>
        </div>
      </div>
    </div>
  );
}
