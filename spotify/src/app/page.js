'use client';

import './page.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) router.push('/dashboard');
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <main className="home-container">
      <h1>Spotify Taste Mixer</h1>
      <p className="home-subtitle">
        Crea una playlist personalizada combinando artistas, géneros, década, mood y popularidad.
      </p>

      {!isAuthenticated() && (
        <button className="spotify-btn" onClick={handleLogin}>
          Login with Spotify
        </button>
      )}
    </main>
  );
}
