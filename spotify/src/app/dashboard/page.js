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
import PlaylistWidget from '../../components/widgets/PlaylistWidget';
import LogOut from '../../components/LogOut'; 

import './page.css'; 

export default function Dashboard() {
  
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);

  //GenreWidget
  const [selectedGenres, setSelectedGenres] = useState([]);
  const updateGenres = (genres) => setSelectedGenres(genres);

  //DecadeWidget
  const [selectedDecades, setSelectedDecades] = useState({
  decades: [],
  startYear: null,
  endYear: null,
  });
  const updateDecades = (decades) => setSelectedDecades(decades);



  //MoodWidget
  const [selectedMood, setSelectedMood] = useState({
  mood: "Happy",
  energy: 50,
  relax: 50,
  danceability: 50,
  melody: 50,
  });
  const updateMood = (moodObj) => setSelectedMood(moodObj);

  //PopularityWidget
  const [selectedPopularity, setSelectedPopularity] = useState(50); 
  const updatePopularity = (popularity) => setSelectedPopularity(popularity);

  //ArtistWidget
  const [selectedArtists, setSelectedArtists] = useState([]);
  const updateSelectedArtists = (ids) => setSelectedArtists(ids);

  //TrackWidget
  const [selectedTracks, setSelectedTracks] = useState([]);
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
      <div className="widget">
        <ArtistWidget
          accessToken={accessToken}
          updateSelectedArtists={updateSelectedArtists}
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
      <div className="widget mt-6">
        <PlaylistWidget
          accessToken={accessToken}
          selectedArtists={selectedArtists}
          selectedGenres={selectedGenres}
          selectedTracks={selectedTracks}
          selectedMood={selectedMood}
          selectedDecades={selectedDecades}
          selectedPopularity={selectedPopularity}
        />
      </div>
      <div className="widget mt-6">
        <LogOut />
      </div>
    </div>
  );
}
