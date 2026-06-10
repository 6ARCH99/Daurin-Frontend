import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const ToggleSwitch = ({ active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
      active ? 'bg-green-600' : 'bg-gray-300'
    }`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
        active ? 'translate-x-6' : 'translate-x-0'
      }`}
    />
  </button>
);

const PUSH_KEYS = [
  { key: 'pushPoints', title: 'Poin Masuk', desc: 'Saat poin ditambahkan' },
  { key: 'pushPickup', title: 'Penjemputan', desc: 'Reminder jadwal penjemputan' },
  { key: 'pushChallenge', title: 'Challenge Baru', desc: 'Info challenge mingguan' },
  { key: 'pushReward', title: 'Reward Tersedia', desc: 'Reward bisa ditukar' },
];

const EMAIL_KEYS = [
  { key: 'emailNewsletter', title: 'Newsletter Mingguan', desc: 'Ringkasan aktivitas' },
  { key: 'emailPromo', title: 'Promo & Penawaran', desc: 'Info promo dan bonus' },
];

const NotificationPage = ({ onBack }) => {
  const [prefs, setPrefs] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getPreferences().then((res) => setPrefs(res.data)).catch((err) => setError(err.message));
  }, []);

  const toggle = async (key) => {
    if (!prefs) return;
    const next = { [key]: !prefs[key] };
    try {
      const res = await api.updatePreferences(next);
      setPrefs(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

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
          <h1 className="type-page-title mb-2">Notifikasi</h1>
          <p className="text-gray-500 text-sm">Atur preferensi pemberitahuan kamu</p>
        </header>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {!prefs && !error && <p className="text-gray-400">Memuat…</p>}

        {prefs && (
          <div className="space-y-6">
            <section className="bg-white rounded-[32px] border p-8 shadow-sm">
              <h2 className="text-lg font-bold text-[#1A3022] mb-6 font-heading">Push Notifications</h2>
              <div className="space-y-3">
                {PUSH_KEYS.map((item) => (
                  <div key={item.key} className="flex justify-between items-center p-4 bg-[#F9F9F6] rounded-2xl">
                    <div>
                      <h4 className="font-bold text-[#1A3022] text-sm">{item.title}</h4>
                      <p className="text-gray-400 text-xs">{item.desc}</p>
                    </div>
                    <ToggleSwitch active={prefs[item.key]} onClick={() => toggle(item.key)} />
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-white rounded-[32px] border p-8 shadow-sm">
              <h2 className="text-lg font-bold text-[#1A3022] mb-6">Email</h2>
              <div className="space-y-3">
                {EMAIL_KEYS.map((item) => (
                  <div key={item.key} className="flex justify-between items-center p-4 bg-[#F9F9F6] rounded-2xl">
                    <div>
                      <h4 className="font-bold text-[#1A3022] text-sm">{item.title}</h4>
                      <p className="text-gray-400 text-xs">{item.desc}</p>
                    </div>
                    <ToggleSwitch active={prefs[item.key]} onClick={() => toggle(item.key)} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
