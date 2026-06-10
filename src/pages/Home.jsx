import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import { api } from '../services/api.js';
import ApiStatusBanner from '../components/ApiStatusBanner.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import RevealGrid from '../components/motion/RevealGrid.jsx';

const formatNumber = (n) => (n != null ? Number(n).toLocaleString('id-ID') : '—');

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const userName = user?.name || user?.fullName || 'Pengguna';

  const loadDashboard = useCallback(() => {
    if (!localStorage.getItem('suarabumi_token')) {
      setLoading(false);
      setError('Belum login dengan API. Gunakan halaman Masuk.');
      setDashboard(null);
      return;
    }

    setLoading(true);
    setError('');
    api.getDashboard()
      .then((res) => {
        setDashboard(res.data);
        setError('');
      })
      .catch((err) => {
        setDashboard(null);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, user?.id]);

  const points = dashboard?.points;
  const co2 = dashboard?.co2;
  const deposits = dashboard?.deposits;
  const chart = dashboard?.depositChartLast7Days ?? [];
  const maxChart = Math.max(...chart.map((d) => d.depositCount), 1);
  const maxTick = Math.max(4, Math.ceil(maxChart / 2) * 2);
  const ticks = Array.from({ length: 5 }, (_, i) => (maxTick / 4) * i);
  const challenges = dashboard?.activeChallenges ?? [];
  const activities = dashboard?.recentActivities ?? [];

  const memberSince = deposits?.memberSince
    ? new Date(deposits.memberSince).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    : '—';

  const showMetrics = !loading && dashboard;

  return (
    <div className="app-page">
      <div className="app-page-inner max-w-6xl">
        <main>
          <Reveal className="app-page-header">
            <h1 className="type-page-title mb-2">
              Selamat Datang, {userName}! 👋
            </h1>
            <p className="type-page-subtitle">
              Terus semangat jaga lingkungan. Kamu sudah berkontribusi banyak!
            </p>
            <ApiStatusBanner error={error} loading={loading} />
            {error && !loading && (
              <button
                type="button"
                onClick={loadDashboard}
                className="mt-2 type-ui-sm text-[#1A3022] underline hover:no-underline btn-motion"
              >
                Coba muat ulang
              </button>
            )}
          </Reveal>

          <RevealGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {loading && !dashboard && (
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-7 rounded-3xl border border-gray-50 h-40 animate-pulse"
                  />
                ))}
              </>
            )}
            {showMetrics && (
              <>
                <StatsCard
                  title="Total Poin"
                  value={formatNumber(points?.total)}
                  icon="🏆"
                  sub={`${points?.progressPercent ?? 0}% menuju level ${points?.nextLevel ?? '—'}`}
                  progress={points?.progressPercent ?? 0}
                  color="bg-white"
                />
                <StatsCard
                  title="CO₂ Diselamatkan"
                  value={`${co2?.totalSavedKg ?? 0} kg`}
                  icon="🌍"
                  sub={`+${co2?.weeklyDeltaKg ?? 0} kg minggu ini 🎉`}
                  trend
                  color="bg-white"
                />
                <StatsCard
                  title="Total Setor"
                  value={`${deposits?.totalCount ?? 0} kali`}
                  icon="📦"
                  sub={`Sejak ${memberSince}`}
                  color="bg-white"
                />
              </>
            )}
            {!loading && !dashboard && (
              <>
                <StatsCard title="Total Poin" value="—" icon="🏆" sub="Data tidak tersedia" color="bg-white" />
                <StatsCard title="CO₂ Diselamatkan" value="—" icon="🌍" sub="Data tidak tersedia" color="bg-white" />
                <StatsCard title="Total Setor" value="—" icon="📦" sub="Data tidak tersedia" color="bg-white" />
              </>
            )}
          </RevealGrid>

          <Reveal delay={120} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm card-interactive">
              <h3 className="type-section-title mb-8">Aktivitas Setor — 7 Hari Terakhir</h3>
              {loading ? (
                <div className="h-56 bg-gray-50 rounded-2xl animate-pulse" />
              ) : chart.length > 0 && chart.some(d => d.depositCount > 0) ? (
                <div className="flex gap-4 h-56">
                  <div className="w-8 flex flex-col justify-between type-caption-bold text-gray-300 pb-8">
                    {[...ticks].reverse().map((t) => (
                      <span key={t}>{Math.round(t)}</span>
                    ))}
                  </div>
                  <div className="relative flex-1 flex flex-col">
                    <div className="relative flex-1">
                      <div className="absolute inset-0 flex flex-col justify-between">
                        {ticks.map((t) => (
                          <div key={t} className="border-t border-gray-100 w-full" />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-end justify-between px-2">
                        {chart.map((day, i) => (
                          <div key={i} className="flex justify-center items-end w-full h-full z-10">
                            <div
                              className="w-10 bg-[#6BA67E] rounded-t-lg transition-all hover:bg-[#2D4A37] cursor-pointer"
                              title={`${day.depositCount} setor`}
                              style={{
                                height: `${(day.depositCount / maxTick) * 100}%`,
                                minHeight: day.depositCount ? '4px' : '0px',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="h-8 flex justify-between px-2 pt-3 items-start">
                      {chart.map((day, i) => (
                        <div key={i} className="flex justify-center w-full">
                          <span className="type-caption-bold text-gray-400 uppercase text-[10px] tracking-wider">{day.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="type-body text-gray-400 text-center py-16">Belum ada data setor minggu ini.</p>
              )}
            </div>

            <div className="bg-[#1A3022] p-8 rounded-[32px] text-white shadow-xl card-interactive">
              <h3 className="type-section-title text-white mb-6">Aksi Cepat</h3>
              <div className="space-y-4">
                <div
                  onClick={() => navigate('/drop-point')}
                  className="bg-white/10 p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/20 border border-white/5 transition-all active:scale-95"
                >
                  <span className="text-2xl">📍</span>
                  <div className="text-left">
                    <p className="type-ui-sm text-white">Cari Drop Point</p>
                    <p className="type-caption text-white/60">Terdekat dari lokasimu</p>
                  </div>
                </div>
                <div
                  onClick={() => navigate('/penjemputan')}
                  className="bg-white/10 p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/20 border border-white/5 transition-all active:scale-95"
                >
                  <span className="text-2xl">📅</span>
                  <div className="text-left">
                    <p className="type-ui-sm text-white">Jadwalkan Penjemputan</p>
                    <p className="type-caption text-white/60">Gratis langsung ke rumah</p>
                  </div>
                </div>
                <div
                  onClick={() => navigate('/reward')}
                  className="bg-[#D99A29] p-5 rounded-2xl flex items-center gap-4 cursor-pointer text-[#1A3022] transition-all hover:scale-[1.03] active:scale-95 shadow-lg"
                >
                  <span className="text-2xl">💰</span>
                  <div className="text-left">
                    <p className="type-ui-sm text-[#1A3022]">Tukar Poin</p>
                    <p className="type-caption-bold text-[#1A3022]/80">Ke GoPay, OVO, Dana</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <RevealGrid className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm card-interactive">
              <h3 className="type-section-title mb-6">Challenge Aktif</h3>
              <div className="space-y-4">
                {loading && <p className="text-sm text-gray-400">Memuat…</p>}
                {!loading && challenges.length === 0 && (
                  <p className="text-sm text-gray-400">Belum ada challenge aktif.</p>
                )}
                {challenges.map((c) => (
                  <div key={c.id} className="p-4 bg-[#F9F9F6] rounded-2xl border border-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <p className="type-ui-sm text-[#2D4A37]">{c.title}</p>
                      <span className="text-xs text-gray-400">🎯</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-[#6BA67E] h-2 rounded-full"
                        style={{ width: `${c.progressPercent}%` }}
                      />
                    </div>
                    <p className="type-caption-bold text-gray-500">
                      {c.progress} / {c.target} {c.unit} ({c.progressPercent}%)
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm card-interactive">
              <div className="flex justify-between items-center mb-6">
                <h3 className="type-section-title">Aktivitas Terakhir</h3>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="type-ui-sm text-[#2D4A37] hover:underline"
                >
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-4">
                {!loading && activities.length === 0 && (
                  <p className="text-sm text-gray-400">Belum ada aktivitas.</p>
                )}
                {activities.map((act) => {
                  const icon = act.type === 'deposit' ? '📦' : act.type === 'redemption' ? '💰' : '🚚';
                  const minus = act.pointsDelta < 0;
                  return (
                    <div
                      key={act.id}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F5F5F0] rounded-xl flex items-center justify-center text-lg">
                          {icon}
                        </div>
                        <div>
                          <p className="type-ui-sm text-[#1A3022]">{act.title}</p>
                          <p className="type-caption text-gray-400">{act.description}</p>
                        </div>
                      </div>
                      <span className={`type-ui-sm font-bold ${minus ? 'text-red-500' : 'text-[#2D4A37]'}`}>
                        {act.pointsDelta > 0 ? '+' : ''}
                        {act.pointsDelta} poin
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </RevealGrid>
        </main>
      </div>
    </div>
  );
};

export default Home;
