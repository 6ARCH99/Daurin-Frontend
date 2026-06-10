import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import ApiStatusBanner from '../components/ApiStatusBanner.jsx';

// DUMMY_LOCKED_BADGES removed - now using real API data only
// If API returns no locked badges, empty state will be shown

const Badges = () => {
  const [earned, setEarned] = useState([]);
  const [locked, setLocked] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    if (!localStorage.getItem('suarabumi_token')) {
      setLoading(false);
      setError('Belum login dengan API. Gunakan halaman Masuk.');
      setEarned([]);
      setLocked([]);
      setProgress(null);
      return;
    }
    setLoading(true);
    setError('');
    api.getBadges()
      .then((res) => {
        setEarned(res.data.earned ?? []);
        setLocked(res.data.locked ?? []);
        setProgress(res.data.progress ?? null);
        setError('');
      })
      .catch((err) => {
        setEarned([]);
        setLocked([]);
        setProgress(null);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const progressWidth = useMemo(() => {
    if (!progress) return '0%';
    return `${Math.min(100, Math.max(0, progress.percent ?? 0))}%`;
  }, [progress]);

  return (
    <div className="min-h-screen bg-[#F9F7F2] px-6 md:px-20 py-10 font-sans text-[#1A2E35]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 font-heading">
          Badges <span className="text-2xl">🎖️</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Kumpulkan badge dan tunjukkan pencapaianmu!</p>
        <ApiStatusBanner error={error} loading={loading} />
        {error && !loading && (
          <button
            type="button"
            onClick={load}
            className="mt-2 text-xs font-bold text-[#1A2E35] underline hover:no-underline"
          >
            Coba muat ulang
          </button>
        )}
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-10 flex justify-between items-center">
        <div className="flex-1">
          <h3 className="font-bold text-[#1A3022] text-sm">Koleksi Badge</h3>
          <p className="text-[10px] text-gray-400">Terus kumpulkan badge dan raih pencapaian!</p>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-green-500 h-full transition-all duration-500" style={{ width: progressWidth }} />
          </div>
        </div>
        <div className="text-right ml-10">
          <span className="text-3xl font-black text-[#1A3022]">
            {progress ? `${progress.earnedCount}/${progress.totalCount}` : '—'}
          </span>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {progress ? `${progress.percent}% complete` : '—'}
          </p>
        </div>
      </div>

      {/* Badge Terkumpul Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold font-heading flex items-center gap-2">
            Badge Terkumpul <span className="text-sm">✨</span>
          </h2>
          <span className="text-[10px] font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">
            {progress ? `${progress.earnedCount} Badges` : '—'}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading && earned.length === 0 && (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-[20px] p-5 border border-gray-100 h-32 animate-pulse" />
              ))}
            </>
          )}
          {!loading && earned.length === 0 && (
            <div className="bg-white rounded-[20px] p-5 border border-gray-100 col-span-2 md:col-span-4">
              <p className="text-xs text-gray-500 font-bold">Belum ada badge.</p>
            </div>
          )}
          {earned.map((badge) => (
            <div key={badge.id} className="bg-[#E6F4EA] rounded-[20px] p-5 border border-green-200 text-center relative group hover:shadow-md transition-all">
              <div className="text-4xl mb-3 mt-2">{badge.icon}</div>
              <h4 className="font-bold text-xs text-[#1A3022] mb-1">{badge.name}</h4>
              <p className="text-[9px] text-green-800 font-bold leading-relaxed min-h-8">
                {badge.description}
              </p>
              <p className="text-[8px] text-gray-400 italic border-t border-green-200 pt-2">
                {badge.earnedAt
                  ? `Didapatkan ${new Date(badge.earnedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`
                  : 'Didapatkan'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Badge Terkunci Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold font-heading flex items-center gap-2">
            Badge Terkunci <span className="text-sm">🔒</span>
          </h2>
          <span className="text-[10px] font-bold text-gray-400">
            {progress ? `${progress.totalCount - progress.earnedCount} Remaining` : '—'}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading && locked.length === 0 && (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-[20px] p-5 border border-gray-100 h-32 animate-pulse" />
              ))}
            </>
          )}
          {!loading && locked.length === 0 && (
            <div className="bg-white/60 rounded-[20px] p-8 border border-dashed border-gray-200 text-center col-span-2 md:col-span-4">
              <p className="text-sm text-gray-500">Tidak ada badge terkunci. Anda sudah mengumpulkan semua badge!</p>
            </div>
          )}
          {!loading && locked.map((badge) => (
            <div key={badge.id} className="bg-white/60 rounded-[20px] p-5 border border-dashed border-gray-200 text-center relative group hover:border-gray-300 hover:bg-white/80 transition-all duration-300">
              {/* Lock overlay icon */}
              <div className="absolute top-3 right-3 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                🔒
              </div>
              <div className="text-4xl mb-3 mt-2 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-300">
                {badge.icon}
              </div>
              <h4 className="font-bold text-xs text-gray-400 mb-1 group-hover:text-gray-600 transition-colors">{badge.name}</h4>
              <p className="text-[9px] text-gray-400 font-bold leading-relaxed min-h-8">
                {badge.description}
              </p>
              {/* Progress hint */}
              {badge.progressHint && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-[8px] text-orange-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    📊 {badge.progressHint}
                  </p>
                  <p className="text-[8px] text-gray-400 group-hover:hidden">Terkunci</p>
                </div>
              )}
              {!badge.progressHint && (
                <p className="text-[8px] text-gray-400 pt-2 border-t border-gray-100">Terkunci</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <div className="bg-[#E6F4EA]/40 rounded-[24px] p-8 border border-green-100">
        <h4 className="font-bold text-[#1A3022] mb-4 flex items-center gap-2">
          <span className="text-lg">💡</span> Tips Mendapatkan Badge
        </h4>
        <ul className="space-y-3">
          {[
            'Setor sampah secara rutin untuk mendapatkan badge harian dan mingguan',
            'Ikuti challenge dan raih bonus badge eksklusif',
            'Ajak teman bergabung dan dapatkan badge referral',
            'Capai target bulanan untuk unlock badge premium'
          ].map((tip, i) => (
            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span> {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Badges;
