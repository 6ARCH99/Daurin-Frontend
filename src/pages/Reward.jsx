import React, { useCallback, useEffect, useState } from 'react';
import Reveal from '../components/motion/Reveal.jsx';
import { Gift, LineChart, Users, Lightbulb, PartyPopper } from 'lucide-react';
import RewardCard from '../components/RewardCard';
import RewardPlatformPicker from '../components/reward/RewardPlatformPicker';
import RewardEwalletForm from '../components/reward/RewardEwalletForm';
import { api } from '../services/api';

const TIERS = [
  { amount: 'Rp 5,000', amountRp: 5000, points: 500 },
  { amount: 'Rp 10,000', amountRp: 10000, points: 1000 },
  { amount: 'Rp 25,000', amountRp: 25000, points: 2500 },
  { amount: 'Rp 50,000', amountRp: 50000, points: 5000 },
];

const TIPS = [
  'Setor sampah rutin setiap minggu',
  'Ikuti challenge mingguan',
  'Ajak teman bergabung',
  'Pilah dengan benar untuk bonus poin',
];

const TABS = [
  { id: 'tukar', label: 'TUKAR', Icon: Gift },
  { id: 'riwayat', label: 'RIWAYAT', Icon: LineChart },
  { id: 'referral', label: 'REFERRAL', Icon: Users },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const RewardSidebar = () => (
  <div className="space-y-5">
    <div className="bg-[#FDFBF0] p-7 rounded-[24px] border-2 border-[#EBA332]/40">
      <h3 className="font-sans text-sm font-semibold text-[#1A3022] mb-4 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-[#EBA332]" strokeWidth={2} />
        Tips Kumpulkan Poin
      </h3>
      <ul className="font-sans text-xs font-normal text-[#1A3022]/80 space-y-3 leading-relaxed">
        {TIPS.map((tip) => (
          <li key={tip}>• {tip}</li>
        ))}
      </ul>
    </div>
    <div className="bg-[#D8E6DC] p-7 rounded-[24px]">
      <h3 className="font-display text-lg font-semibold text-[#1A3022] mb-2 tracking-tight">Poin = Uang Nyata</h3>
      <p className="font-sans text-sm font-semibold text-[#2D6A4F] mb-2">1 poin = Rp 10</p>
      <p className="font-sans text-xs font-normal text-[#1A3022]/70 leading-relaxed">
        Proses pencairan 1x24 jam ke e-wallet pilihanmu
      </p>
    </div>
  </div>
);

const Reward = () => {
  const [activeTab, setActiveTab] = useState('tukar');
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [referral, setReferral] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [platform, setPlatform] = useState('gopay');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadBalance = useCallback(async () => {
    const { data } = await api.getRewardBalance();
    setBalance(data);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await loadBalance();
      const [histRes, refRes, walletRes] = await Promise.all([
        api.getRewardHistory(),
        api.getReferralStats(),
        api.getEwallet(),
      ]);
      setHistory(histRes.data || []);
      setReferral(refRes.data);
      setWallet(walletRes.data);
      if (walletRes.data?.platform) setPlatform(walletRes.data.platform);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadBalance]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const available = balance?.available ?? 0;

  const handleRedeem = async (tier) => {
    if (!wallet?.verified) {
      setError('Simpan nomor e-wallet terlebih dahulu.');
      return;
    }
    setRedeeming(true);
    setError('');
    setMessage('');
    try {
      const res = await api.redeemPoints(platform, tier.amountRp);
      setMessage(`Penukaran diproses. Poin: -${res.data.pointsDeducted}`);
      await loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setRedeeming(false);
    }
  };

  const copyCode = () => {
    if (referral?.code) navigator.clipboard?.writeText(referral.code);
    setMessage('Kode disalin!');
  };

  const shareCode = () => {
    const text = `Gabung Daurin dengan kode ${referral?.code || ''}`;
    if (navigator.share) navigator.share({ title: 'Daurin', text }).catch(() => {});
    else {
      navigator.clipboard?.writeText(text);
      setMessage('Teks bagikan disalin!');
    }
  };

  return (
    <div className="app-page">
      <div className="app-page-inner max-w-6xl">
        {error && (
          <p className="mb-4 font-sans text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-4 font-sans text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            {message}
          </p>
        )}

        {/* Hero */}
        <Reveal variant="scale" className="bg-[#1A3022] rounded-[24px] p-8 md:p-10 text-white mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-white/60 mb-3">
                REWARD CENTRE
              </p>
              <p className="font-display text-[3.5rem] md:text-[3.75rem] font-bold leading-none tracking-tight text-white animate-stat">
                {loading ? '…' : available.toLocaleString('id-ID')}
              </p>
              <p className="font-sans text-sm font-normal text-white/75 mt-2">Poin tersedia</p>
            </div>
            <div className="flex gap-10 lg:gap-14 lg:border-l lg:border-white/15 lg:pl-10">
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-white/60 mb-2">
                  POIN MASUK
                </p>
                <p className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
                  {(balance?.totalEarned ?? 0).toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-white/60 mb-2">
                  POIN TERPAKAI
                </p>
                <p className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
                  {(balance?.totalSpent ?? 0).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
          {balance?.nextReward && (
            <div className="mt-8 pt-2">
              <p className="font-sans text-xs font-medium text-white/90 mb-3">
                Butuh {balance.nextReward.pointsNeeded} poin lagi untuk reward Rp{' '}
                {balance.nextReward.nextAmountRp.toLocaleString('id-ID')}
              </p>
              <div className="w-full bg-white/15 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#A8D5BA] h-full rounded-full transition-all duration-500"
                  style={{ width: `${balance.nextReward.progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </Reveal>

        <div className="flex flex-wrap gap-3 mb-8">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`px-6 py-3 rounded-2xl font-sans text-xs font-bold uppercase tracking-wide flex items-center gap-2 border btn-motion ${
                activeTab === id
                  ? 'bg-[#1A3022] text-white border-[#1A3022] shadow-sm'
                  : 'bg-white text-[#1A3022] border-gray-100 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={2.5} />
              {label}
            </button>
          ))}
        </div>

        <div key={activeTab} className="animate-page grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'tukar' && (
              <>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#1A3022] tracking-tight mb-2">
                    Tukar Poin ke E-Wallet
                  </h2>
                  <p className="font-sans text-sm font-normal text-gray-500">
                    Pilih platform e-wallet favoritmu dan tukar poin menjadi saldo nyata
                  </p>
                </div>

                <RewardPlatformPicker value={platform} onChange={setPlatform} />

                <div>
                  <h3 className="font-display text-lg font-semibold text-[#1A3022] tracking-tight mb-4">
                    Pilih Nominal
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TIERS.map((tier) => (
                      <RewardCard
                        key={tier.amountRp}
                        amount={tier.amount}
                        points={tier.points.toLocaleString('id-ID')}
                        isLocked={available < tier.points}
                        loading={redeeming}
                        onRedeem={() => handleRedeem(tier)}
                      />
                    ))}
                  </div>
                </div>

                <RewardEwalletForm
                  platform={platform}
                  onPlatformChange={setPlatform}
                  wallet={wallet}
                  onSaved={loadAll}
                />
              </>
            )}

            {activeTab === 'riwayat' && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#1A3022] tracking-tight mb-6">
                  Riwayat Penukaran Poin
                </h2>
                {history.length === 0 && !loading && (
                  <p className="font-sans text-sm text-gray-400">Belum ada riwayat.</p>
                )}
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-sans text-sm font-semibold text-[#1A3022]">{item.description}</p>
                        <p className="font-sans text-xs font-normal text-gray-400 mt-0.5">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                      <p
                        className={`font-sans text-sm font-bold ${
                          item.amount > 0 ? 'text-[#2D6A4F]' : 'text-[#EBA332]'
                        }`}
                      >
                        {item.amount > 0 ? '+' : ''}
                        {item.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'referral' && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#1A3022] tracking-tight mb-2 flex items-center gap-2">
                  Ajak Teman, Dapat Bonus! <PartyPopper className="w-6 h-6 text-[#D99A29]" />
                </h2>
                <p className="font-sans text-sm font-normal text-gray-500 mb-8">
                  Setiap teman yang bergabung dan setor pertama kali, kalian berdua langsung dapat +100 poin.
                </p>
                <div className="bg-white rounded-[24px] border border-gray-100 p-10 text-center mb-6 shadow-sm">
                  <p className="font-sans text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                    Kode Unikmu
                  </p>
                  <p className="font-display text-5xl font-bold text-[#1A3022] tracking-tight mb-8">
                    {referral?.code || '—'}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      type="button"
                      onClick={copyCode}
                      className="bg-[#1A3022] text-white px-10 py-3 rounded-2xl font-sans text-xs font-semibold"
                    >
                      Salin Kode
                    </button>
                    <button
                      type="button"
                      onClick={shareCode}
                      className="bg-gray-50 text-[#1A3022] px-10 py-3 rounded-2xl font-sans text-xs font-semibold border border-gray-100"
                    >
                      Bagikan
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: referral?.invited ?? 0, label: 'Teman diajak' },
                    { val: referral?.joined ?? 0, label: 'Sudah bergabung' },
                    { val: referral?.totalBonusPoints ?? 0, label: 'Total bonus poin' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-[#E7F7EF] border border-[#CDE5D9] p-4 rounded-2xl text-center"
                    >
                      <p className="font-display text-2xl font-bold text-[#1A3022]">{stat.val}</p>
                      <p className="font-sans text-[10px] font-bold uppercase text-[#2D6A4F] mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <RewardSidebar />
        </div>
      </div>
    </div>
  );
};

export default Reward;
