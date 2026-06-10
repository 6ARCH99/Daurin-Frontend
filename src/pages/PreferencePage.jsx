import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const PreferencePage = ({ onBack }) => {
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getPreferences();
        setPrefs(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async (patch) => {
    setSaved(false);
    setError('');
    try {
      const res = await api.updatePreferences(patch);
      setPrefs(res.data);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center text-gray-500">
        Memuat preferensi…
      </div>
    );
  }

  if (!prefs) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] p-8">
        <p className="text-red-600">{error || 'Gagal memuat preferensi.'}</p>
        <button type="button" onClick={onBack} className="mt-4 underline">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-[#1A3022] mb-8 group">
          <div className="p-2 bg-white rounded-full shadow-sm group-hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <span className="font-medium">Kembali</span>
        </button>

        <header className="mb-10">
          <h1 className="type-page-title mb-2">Preferensi</h1>
          <p className="text-gray-500 text-sm">Disimpan ke server</p>
        </header>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {saved && <p className="mb-4 text-sm text-green-700">Preferensi disimpan.</p>}

        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#1A3022] mb-4">Bahasa</h2>
            <select
              value={prefs.language}
              onChange={(e) => save({ language: e.target.value })}
              className="w-full p-4 bg-[#F9F9F6] rounded-2xl border text-sm font-medium"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="bg-white rounded-[32px] border p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#1A3022] mb-4">Metode Setor Default</h2>
            <div className="space-y-3">
              {[
                { id: 'pickup', title: 'Jemput di Rumah', desc: 'Kurir datang ke lokasi kamu' },
                { id: 'drop_point', title: 'Antar ke Drop Point', desc: 'Setor langsung ke titik pengumpulan' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => save({ defaultDepositMethod: opt.id })}
                  className={`w-full text-left p-4 rounded-2xl border ${
                    prefs.defaultDepositMethod === opt.id
                      ? 'border-green-600 ring-1 ring-green-600 bg-[#F9F9F6]'
                      : 'border-gray-50 bg-[#F9F9F6] opacity-80'
                  }`}
                >
                  <h4 className="font-bold text-[#1A3022] text-sm">{opt.title}</h4>
                  <p className="text-gray-400 text-xs mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] border p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#1A3022] mb-4">Privasi</h2>
            <div className="flex items-center justify-between p-4 bg-[#F9F9F6] rounded-2xl">
              <div>
                <h4 className="font-bold text-[#1A3022] text-sm">Tampilkan di Leaderboard</h4>
                <p className="text-gray-400 text-[10px]">Nama dan peringkat publik</p>
              </div>
              <button
                type="button"
                onClick={() => save({ showOnLeaderboard: !prefs.showOnLeaderboard })}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  prefs.showOnLeaderboard ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow transform ${
                    prefs.showOnLeaderboard ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencePage;
