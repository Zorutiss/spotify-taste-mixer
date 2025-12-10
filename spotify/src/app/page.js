'use client';

import './page.css'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';
import ArtistWidget from '../components/widgets/ArtistWidget';
import TrackWidget from '../components/widgets/TrackWidget';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
      <>
        🎵 Spotify Taste Mixer
        {!isAuthenticated() ? (
        <button onClick={handleLogin}>Login with Spotify</button>  
      ) : (
        <ArtistWidget />  
      )}
      </>  
  );
}


