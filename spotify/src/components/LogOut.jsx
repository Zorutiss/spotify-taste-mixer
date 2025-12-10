'use client';

import { useRouter } from 'next/navigation';
import '../components/style/LogOut.css'
export default function LogOut() {
  const router = useRouter();

  const handleLogout = () => {
   
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiration');


    router.push('/');
    
    window.location.reload();
  };

  return (
    <div className="logout-container">
      <button 
        onClick={handleLogout} 
        className="logout-button bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
