'use client';

import { useRouter } from 'next/navigation';

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
    <div className="flex justify-center">
      <button
        type="button"
        onClick={handleLogout}
        className="
          w-full sm:w-auto
          rounded-full
          bg-red-500/90 px-6 py-2
          text-sm font-semibold text-white
          ring-1 ring-red-400/4
          hover:bg-red-500
          transition
        "
      >
        Cerrar sesión
      </button>
    </div>
  );
}
