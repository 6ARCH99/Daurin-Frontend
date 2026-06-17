import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import ApiStatusBanner from '../components/ApiStatusBanner.jsx';
import { Trophy, Target, Clock, Calendar, Users, Medal, Gift, Lightbulb, AlertTriangle, Ban, Rocket } from 'lucide-react';

const Challenge = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [confirmingCancel, setConfirmingCancel] = useState(null);

  const load = useCallback(() => {
    if (!localStorage.getItem('suarabumi_token')) {
      setLoading(false);
      setError('Belum login dengan API. Gunakan halaman Masuk.');
      setOverview(null);
      return;
    }
    setLoading(true);
    setError('');
    api.getChallengeOverview()
      .then((res) => {
        setOverview(res.data);
        setError('');
      })
      .catch((err) => {
        setOverview(null);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const featured = overview?.featuredChallenge ?? null;
  const activeChallenges = overview?.activeChallenges ?? [];
  const availableChallenges = overview?.availableChallenges ?? [];
  const leaderboard = overview?.leaderboard ?? [];
  const badges = overview?.badges ?? [];

  const difficultyMeta = useMemo(
    () => ({
      easy: { label: 'Easy', color: 'text-blue-400 bg-blue-50' },
      medium: { label: 'Medium', color: 'text-orange-400 bg-orange-50' },
      hard: { label: 'Hard', color: 'text-red-400 bg-red-50' },
    }),
    []
  );

  const join = useCallback(
    async (challengeId) => {
      if (!challengeId) return;
      try {
        await api.joinChallenge(challengeId);
        setSelectedChallenge(null);
        load();
      } catch (err) {
        setError(err?.message ?? 'Gagal ikut challenge.');
      }
    },
    [load]
  );

  const cancel = useCallback(
    async (challengeId) => {
      if (!challengeId) return;
      try {
        await api.cancelChallenge(challengeId);
        setSelectedChallenge(null);
        load();
      } catch (err) {
        setError(err?.message ?? 'Gagal membatalkan challenge.');
      }
    },
    [load]
  );

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
  }, [featured?.endsAt]);

  const featuredEndsText = useMemo(() => {
    if (!featured?.endsAt) return '—';
    const daysLeft = Math.max(
      0,
      Math.ceil((new Date(featured.endsAt).getTime() - now) / 86400000)
    );
    return daysLeft <= 1 ? 'Berakhir hari ini' : `Berakhir dalam ${daysLeft} hari`;
  }, [featured?.endsAt, now]);

  const formatPoints = (n) => (n != null ? Number(n).toLocaleString('id-ID') : '—');

  return (
    <div className="min-h-screen bg-[#F9F7F2] px-6 md:px-20 py-10 font-sans text-[#1A2E35]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          Challenge <Target className="w-8 h-8 text-[#D99A29]" />
        </h1>
        <p className="text-gray-500 mt-2">Ikuti tantangan seru dan raih poin bonus!</p>
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

      {/* Challenge Unggulan */}
      <section className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mb-12">
        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
          Challenge Unggulan
        </span>
        <h2 className="text-3xl font-bold mt-4 font-heading">{featured?.title ?? '—'}</h2>
        <p className="text-sm text-gray-400 mt-1">
          {featured ? `${featured.joinedCount ?? 0} orang bergabung · ${featuredEndsText}` : '—'}
        </p>
        
        <div className="mt-6">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span>
              Progress: {featured?.progress ?? 0} / {featured?.target ?? 0} {featured?.unit ?? ''}
            </span>
            <span className="text-green-600">{featured?.progressPercent ?? 0}%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-[#86BC8A] h-full rounded-full transition-all duration-1000"
              style={{ width: `${featured?.progressPercent ?? 0}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          disabled={!featured || featured.joined}
          onClick={() => join(featured?.id)}
          className={`mt-8 px-8 py-3 rounded-full font-bold text-sm transition-all ${
            !featured || featured.joined
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#1A2E35] text-white hover:bg-[#2d4a37]'
          }`}
        >
          {featured?.joined ? 'Sudah Diikuti' : `Ikut Sekarang · +${featured?.rewardPoints ?? 0} poin`}
        </button>
      </section>

      {/* Challenge Aktif */}
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-6 font-heading">Challenge Aktif</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading && activeChallenges.length === 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 h-40 animate-pulse" />
          )}
          {!loading && activeChallenges.length === 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
              <p className="text-sm text-gray-400">Belum ada challenge aktif.</p>
            </div>
          )}
          {activeChallenges.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 relative group">
              <span className="absolute top-6 right-6 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">{item.description}</p>
              <div className="flex items-center justify-between mt-6 text-[11px] font-bold">
                <span className="text-gray-400 flex items-center gap-1">🕒 {item.durationDays} hari</span>
                <span className="text-green-600">+{item.rewardPoints} pts</span>
              </div>
              <button 
                onClick={() => setSelectedChallenge({ ...item, isActive: true })}
                className="w-full mt-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold group-hover:bg-[#E9F5EF] group-hover:text-[#2D4A37] transition-all">
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Challenge Tersedia (Bagian Baru yang Ditambahkan) */}
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-6 font-heading">Challenge Tersedia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading && availableChallenges.length === 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 h-44 animate-pulse" />
          )}
          {!loading && availableChallenges.length === 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
              <p className="text-sm text-gray-400">Tidak ada challenge tersedia.</p>
            </div>
          )}
          {availableChallenges.map((item) => {
            const meta = difficultyMeta[item.difficulty] ?? difficultyMeta.medium;
            return (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-sm w-2/3">{item.title}</h4>
                <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase ${meta.color}`}>
                  {meta.label}
                </span>
              </div>
              <p className="text-gray-400 text-[11px] mb-4 h-8">{item.description}</p>
              <div className="flex items-center gap-4 text-[10px] text-gray-400 mb-4">
                <span>📅 {item.durationDays} hari</span>
                <span>👥 {item.joinedCount ?? 0} joined</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                <span className="font-bold text-green-600 text-xs">+{item.rewardPoints} pts</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedChallenge({ ...item, isAvailable: true })}
                    className="bg-gray-100 text-[#1A2E35] px-4 py-2 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-colors"
                  >
                    Detail
                  </button>
                  <button
                    type="button"
                    onClick={() => join(item.id)}
                    className="bg-[#1A2E35] text-white px-4 py-2 rounded-lg text-[10px] font-bold hover:opacity-90 transition-opacity"
                  >
                    Ikut
                  </button>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </section>

      {/* Leaderboard & Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Leaderboard */}
        <section>
          <div className="flex items-center gap-2 mb-6">
             <span className="bg-green-100 p-2 rounded-lg text-green-700 text-lg">🏆</span>
             <h3 className="text-xl font-bold font-heading">Leaderboard</h3>
          </div>
          <div className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-50">
            {leaderboard.map((user, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-4 rounded-2xl mb-2 transition-all ${user.isUser ? 'bg-[#FFF9E7] border border-orange-200' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${
                    user.rank === 1 ? 'bg-orange-400 text-white' : 
                    user.rank === 2 ? 'bg-gray-300 text-white' : 
                    user.rank === 3 ? 'bg-orange-200 text-white' : 'text-gray-400'
                  }`}>
                    {user.rank}
                  </span>
                  <span className="font-bold text-sm text-[#1A2E35]">{user.name}</span>
                </div>
                <span className="font-bold text-sm text-[#1A2E35]">{formatPoints(user.points)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section>
          <div className="flex items-center gap-2 mb-6">
             <span className="bg-green-100 p-2 rounded-lg text-green-700 text-lg">🏅</span>
             <h3 className="text-xl font-bold font-heading">Badges</h3>
          </div>
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 grid grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center justify-center text-center group cursor-help">
                <div className={`w-16 h-20 flex items-center justify-center rounded-2xl text-2xl mb-2 transition-all duration-300 ${
                  badge.active ? 'bg-[#E9F5EF] scale-100' : 'bg-gray-50 grayscale opacity-40 scale-95'
                } group-hover:scale-105`}>
                  {badge.icon}
                </div>
                <span className={`text-[10px] font-bold tracking-tight ${badge.active ? 'text-[#2D4A37]' : 'text-gray-300'}`}>
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Detail Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 modal-backdrop" onClick={() => setSelectedChallenge(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-xl modal-panel" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedChallenge(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 font-bold transition-colors"
            >
              ✕
            </button>

            {/* Status Badge */}
            <div className="mb-4">
              {selectedChallenge.isActive ? (
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  ✅ Sedang Diikuti
                </span>
              ) : (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  📋 Tersedia
                </span>
              )}
            </div>

            <h3 className="text-2xl font-bold mb-2">{selectedChallenge.title}</h3>
            
            {/* Meta info */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <Gift size={14} /> +{selectedChallenge.rewardPoints} pts
              </span>
              <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <Clock size={14} /> {selectedChallenge.durationDays} hari
              </span>
              {selectedChallenge.joinedCount != null && (
                <span className="text-xs font-bold text-purple-500 bg-purple-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Users size={14} /> {selectedChallenge.joinedCount} peserta
                </span>
              )}
              {selectedChallenge.difficulty && (
                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                  selectedChallenge.difficulty === 'easy' ? 'text-blue-400 bg-blue-50' :
                  selectedChallenge.difficulty === 'hard' ? 'text-red-400 bg-red-50' :
                  'text-orange-400 bg-orange-50'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${selectedChallenge.difficulty === 'easy' ? 'bg-blue-400' : selectedChallenge.difficulty === 'hard' ? 'bg-red-400' : 'bg-orange-400'}`} />
                  {selectedChallenge.difficulty}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {selectedChallenge.description}
            </p>

            {/* Progress bar for active challenges */}
            {selectedChallenge.isActive && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-green-600">{selectedChallenge.progressPercent ?? 0}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#2D6A4F] to-[#86BC8A] h-full rounded-full transition-all duration-700"
                    style={{ width: `${selectedChallenge.progressPercent ?? 0}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                  {selectedChallenge.progress ?? 0} / {selectedChallenge.target ?? '—'} {selectedChallenge.unit ?? ''}
                </p>
              </div>
            )}

            {/* Rules / Tips */}
            <div className="bg-[#F9F7F2] rounded-2xl p-4 mb-6">
              <h4 className="text-xs font-bold text-[#1A3022] mb-2 flex items-center gap-1"><Lightbulb size={14} /> Cara Menyelesaikan</h4>
              <ul className="space-y-1.5">
                <li className="text-[11px] text-gray-500 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span> Setor sampah sesuai target yang ditentukan
                </li>
                <li className="text-[11px] text-gray-500 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span> Pastikan sampah dipilah dengan benar
                </li>
                <li className="text-[11px] text-gray-500 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span> Selesaikan sebelum batas waktu berakhir
                </li>
              </ul>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-3">
              {selectedChallenge.isActive ? (
                <>
                  {confirmingCancel === selectedChallenge.id ? (
                    <>
                      <button
                        onClick={() => { cancel(selectedChallenge.id); setConfirmingCancel(null); }}
                        className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors text-sm flex items-center justify-center gap-1"
                      >
                        <AlertTriangle size={16} /> Ya, Batalkan
                      </button>
                      <button
                        onClick={() => setConfirmingCancel(null)}
                        className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm"
                      >
                        Kembali
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmingCancel(selectedChallenge.id)}
                      className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors text-sm border border-red-100 flex items-center justify-center gap-1"
                    >
                      <Ban size={16} /> Batalkan Challenge
                    </button>
                  )}
                </>
              ) : selectedChallenge.isAvailable ? (
                <button
                  onClick={() => join(selectedChallenge.id)}
                  className="flex-1 bg-[#1A2E35] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
                >
                  <Rocket size={16} /> Ikut Challenge <span className="text-green-400">+{selectedChallenge.rewardPoints} pts</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenge;
