'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth'; 
import ArtistWidget from '../../components/widgets/ArtistWidget';
import TrackWidget from '../../components/widgets/TrackWidget';  
import GenreWidget from '../../components/widgets/GenreWidget';
import DecadeWidget from '../../components/widgets/DecadeWidget';  
import MoodWidget from '../../components/widgets/MoodWidget';
import './page.css'; 

export default function Dashboard() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');  
    } else {
      const token = localStorage.getItem('spotify_token');
      setAccessToken(token);  
    }
  }, [router]);

  if (!accessToken) {
    return <div>Loading...</div>;  
  }

  return (
    <div className="dashboard-container">
      <h2>Spotify</h2>

      <div className="widget">
        <ArtistWidget accessToken={accessToken} />
      </div>

      <div className="widget mt-6">
        <TrackWidget accessToken={accessToken} />
      </div>

      <div className="widget mt-6">
        <GenreWidget />
      </div>

      <div className="widget mt-6">
        <DecadeWidget />
      </div>

      <div className="widget mt-6">
        <MoodWidget />
      </div>
    </div>
  );
}
