import { getStoredUser } from '../services/api.js';

/** Shown when the UI is open but API data could not be loaded. */
export default function ApiStatusBanner({ error, loading }) {
  const hasToken = !!localStorage.getItem('suarabumi_token');

  if (loading) {
    return (
      <p className="text-xs font-bold text-[#2D4A37] bg-[#E9F5EF] px-4 py-2 rounded-xl mb-4">
        Memuat data dari server…
      </p>
    );
  }

  if (!hasToken) {
    return (
      <div className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl mb-4">
        Anda masuk tanpa login API (mis. lewat OTP demo). Keluar lalu masuk dengan{' '}
        <span className="underline">putra.wijaya@email.com</span> / password123, dan pastikan backend
        berjalan (<code className="text-[10px]">npm run dev:all</code>).
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs font-bold text-red-800 bg-red-50 border border-red-200 px-4 py-3 rounded-xl mb-4">
        Gagal memuat data: {error}. Pastikan backend aktif di port 3001 dan Anda membuka app lewat Vite
        (localhost:5173), bukan hanya port 3001.
      </div>
    );
  }

  return null;
}
