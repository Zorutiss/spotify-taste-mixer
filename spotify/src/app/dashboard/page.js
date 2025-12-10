'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth'; 
import ArtistWidget from '../../components/widgets/ArtistWidget';
import TrackWidget from '../../components/widgets/TrackWidget';  
import GenreWidget from '../../components/widgets/GenreWidget';
import DecadeWidget from '../../components/widgets/DecadeWidget';  
import MoodWidget from '../../components/widgets/MoodWidget';  
import PopularityWidget from '../../components/widgets/PopularityWidget';  
import LogOut from '../../components/LogOut'; 

import './page.css'; 

export default function Dashboard() {
  
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [selectedMood, setSelectedMood] = useState('Energético'); 
  const [selectedPopularity, setSelectedPopularity] = useState(50); 
  const [selectedTracks, setSelectedTracks] = useState([]);

  //
  const updateGenres = (genres) => setSelectedGenres(genres);
  const updateDecades = (decades) => setSelectedDecades(decades);
  const updateMood = (mood) => setSelectedMood(mood);
  const updatePopularity = (popularity) => setSelectedPopularity(popularity);
  const updateSelectedTracks = (tracks) => setSelectedTracks(tracks);

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


      <div className="widget mt-6">
        <LogOut />
      </div>


      <div className="widget">
        <ArtistWidget 
          accessToken={accessToken} 
          updateSelectedTracks={updateSelectedTracks} 
        />
      </div>

      <div className="widget mt-6">
        <TrackWidget 
          accessToken={accessToken} 
          selectedTracks={selectedTracks} 
          updateSelectedTracks={updateSelectedTracks} 
        />
      </div>

      <div className="widget mt-6">
        <GenreWidget updateGenres={updateGenres} />
      </div>

      <div className="widget mt-6">
        <DecadeWidget updateDecades={updateDecades} /> 
      </div>

      <div className="widget mt-6">
        <MoodWidget updateMood={updateMood} /> 
      </div>

      <div className="widget mt-6">
        <PopularityWidget updatePopularity={updatePopularity} /> 
      </div>
    </div>
  );
}
