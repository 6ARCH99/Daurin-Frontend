import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import ApiStatusBanner from '../components/ApiStatusBanner.jsx';
import ContributionLineChart from '../components/ContributionLineChart.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import RevealGrid from '../components/motion/RevealGrid.jsx';
import { TreePine, Droplets, Zap, Globe, Users, Share2 } from 'lucide-react';

// Share buttons component
const ShareButtons = ({ impact }) => {
  const handleShareWhatsApp = () => {
    if (!impact) return;
    const message = `Aku sudah menyelamatkan lingkungan setara dengan menanam ${impact.treesEquivalent} pohon! 🌳 \n\nBergabunglah dengan Daurin dan tunjukkan dampak positifmu juga! #TunasAction #ClimateHero`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleShareTwitter = () => {
    if (!impact) return;
    const text = `Aku sudah menyelamatkan lingkungan setara dengan menanam ${impact.treesEquivalent} pohon! 🌳 Bergabunglah dengan @DaurinApp dan tunjukkan dampak positifmu! #TunasAction #ClimateHero`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  };

  const handleShareInstagram = () => {
    if (!impact) return;
    const message = `Aku sudah menyelamatkan lingkungan setara dengan menanam ${impact.treesEquivalent} pohon! 🌳\n\nBergabunglah dengan Daurin dan tunjukkan dampak positifmu! #TunasAction #ClimateHero #Daurin`;
    navigator.clipboard.writeText(message).then(() => {
      alert('Pesan disalin. Silakan buka Instagram dan bagikan di story atau post Anda.');
    }).catch(() => {
      alert('Gagal menyalin pesan. Coba secara manual.');
    });
  };

  const buttons = [
    { name: 'WhatsApp', color: 'bg-[#25D366] text-white', onClick: handleShareWhatsApp },
    { name: 'Instagram', color: 'bg-gradient-to-r from-[#f09433] to-[#bc1888] text-white', onClick: handleShareInstagram },
    { name: 'Twitter', color: 'bg-[#1DA1F2] text-white', onClick: handleShareTwitter },
  ];

  return (
    <>
      {buttons.map((s) => (
        <button
          key={s.name}
          type="button"
          onClick={s.onClick}
          className={`${s.color} px-5 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity`}
        >
          {s.name}
        </button>
      ))}
    </>
  );
};

const ImpactPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!mounted) return;
      setLoading(true);
      try {
        const res = await api.getClimateImpact();
        if (!mounted) return;
        setData(res.data);
        setError('');
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const impact = data?.impactMetrics;
  const trend = data?.contributionTrend6Months;
  const comparison = data?.comparison;
  const rank = data?.communityRank;

  const handleShareWhatsApp = () => {
    if (!impact) return;
    const message = `Aku sudah menyelamatkan lingkungan setara dengan menanam ${impact.treesEquivalent} pohon! 🌳 \n\nBergabunglah dengan Daurin dan tunjukkan dampak positifmu juga! #TunasAction #ClimateHero`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleShareTwitter = () => {
    if (!impact) return;
    const text = `Aku sudah menyelamatkan lingkungan setara dengan menanam ${impact.treesEquivalent} pohon! 🌳 Bergabunglah dengan @DaurinApp dan tunjukkan dampak positifmu! #TunasAction #ClimateHero`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  };

  const handleShareInstagram = () => {
    if (!impact) return;
    const message = `Aku sudah menyelamatkan lingkungan setara dengan menanam ${impact.treesEquivalent} pohon! 🌳\n\nBergabunglah dengan Daurin dan tunjukkan dampak positifmu! #TunasAction #ClimateHero #Daurin`;
    // Instagram doesn't have a direct share URL, so copy to clipboard instead
    navigator.clipboard.writeText(message).then(() => {
      alert('Pesan disalin. Silakan buka Instagram dan bagikan di story atau post Anda.');
    }).catch(() => {
      alert('Gagal menyalin pesan. Coba secara manual.');
    });
  };

  const metrics = impact
    ? [
        {
          value: `${impact.treesEquivalent} pohon`,
          label: 'Setara Menanam',
          sub: 'CO₂ yang diserap',
          Icon: TreePine,
          iconBg: 'bg-[#E9F5EF]',
        },
        {
          value: `${impact.waterSavedLiters} Liter`,
          label: 'Air Dihemat',
          sub: 'Dari proses daur ulang',
          Icon: Droplets,
          iconBg: 'bg-[#E9F5EF]',
        },
        {
          value: `${impact.energySavedKwh} kWh`,
          label: 'Energi Dihemat',
          sub: 'Listrik yang tidak terpakai',
          Icon: Zap,
          iconBg: 'bg-[#FFF4E0]',
        },
      ]
    : [];

  const changePct = trend?.changePercentFromLastMonth ?? 0;

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans pb-12">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        {/* Header */}
        <Reveal as="header" className="mb-10">
          <h1 className="type-page-title mb-2 flex items-center gap-2">
            Dampak Iklimmu <Globe className="w-8 h-8 text-[#2D6A4F]" />
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Lihat kontribusi nyata kamu terhadap lingkungan
          </p>
          <div className="mt-4">
            <ApiStatusBanner error={error} loading={loading} />
          </div>
        </Reveal>

        {/* Climate impact metrics — Impact page only (not Home stats) */}
        <RevealGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {loading && metrics.length === 0 && (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-[32px] p-10 h-52 animate-pulse border border-gray-100"
                />
              ))}
            </>
          )}
          {metrics.map((m) => (
            <article
              key={m.label}
              className="bg-white rounded-[32px] p-10 text-center shadow-sm border border-gray-100"
            >
              <div
                className={`w-[72px] h-[72px] ${m.iconBg} rounded-full flex items-center justify-center mx-auto mb-8`}
              >
                {m.Icon && <m.Icon size={32} className="text-[#2D6A4F]" />}
              </div>
              <p className="text-3xl md:text-4xl font-bold text-[#1A3022] mb-2 leading-none">
                {m.value}
              </p>
              <p className="font-bold text-[#1A3022] text-base mb-1">{m.label}</p>
              <p className="text-xs text-gray-400">{m.sub}</p>
            </article>
          ))}
        </RevealGrid>

        {/* Trend Kontribusi — line chart */}
        <Reveal delay={200} as="section" className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A3022] font-heading">Trend Kontribusi</h2>
              <p className="text-sm text-gray-400 mt-1">
                Total sampah terpilah 6 bulan terakhir
              </p>
            </div>
            {trend && !loading && (
              <span className="self-start bg-[#E9F5EF] text-[#2D4A37] text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap">
                {changePct >= 0 ? '+' : ''}
                {changePct}% dari bulan lalu
              </span>
            )}
          </div>

          <ContributionLineChart
            labels={trend?.labels ?? []}
            values={trend?.weightKg ?? []}
            loading={loading}
          />
        </Reveal>

        {/* Bottom row */}
        <RevealGrid className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Perbandingan Pengguna */}
          <article className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 bg-[#F5F5F0] rounded-xl flex items-center justify-center">
                <Users size={24} className="text-[#2D6A4F]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1A3022] font-heading">
                  Perbandingan Pengguna
                </h3>
                <p className="text-xs text-gray-400">Lihat posisi kamu di komunitas</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#FFF8F0] border border-[#FFE8CC] rounded-2xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-flex items-center gap-2">
                      <span className="bg-[#E67E22] text-white text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center">
                        1
                      </span>
                      <span className="font-bold text-[#1A3022]">Kamu</span>
                    </span>
                    {rank && (
                      <p className="text-[11px] text-[#E67E22] font-bold mt-2 ml-7">
                        {rank.label} pengguna
                      </p>
                    )}
                  </div>
                  <span className="text-xl font-bold text-[#1A3022]">
                    {comparison?.userKgPerMonth ?? '—'} kg
                  </span>
                </div>
                <div className="h-2 bg-[#FFE8CC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E67E22] rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        ((comparison?.userKgPerMonth ?? 0) /
                          Math.max(comparison?.communityAvgKgPerMonth ?? 1, comparison?.userKgPerMonth ?? 1)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-[#F5F5F0] rounded-2xl p-5 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-500 text-sm">Rata-rata Komunitas</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">kg/bulan</p>
                </div>
                <span className="text-lg font-bold text-gray-500">
                  {comparison?.communityAvgKgPerMonth ?? '—'} kg
                </span>
              </div>
            </div>
          </article>

          {/* Bagikan Pencapaian */}
          <article className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-[#E9F5EF] rounded-xl flex items-center justify-center">
                <Share2 size={24} className="text-[#2D6A4F]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1A3022] font-heading">
                  Bagikan Pencapaian
                </h3>
                <p className="text-xs text-gray-400">Inspirasi teman-temanmu!</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-6">
              {impact ? (
                <>
                  &ldquo;Aku sudah menyelamatkan lingkungan setara dengan menanam{' '}
                  <strong>{impact.treesEquivalent} pohon</strong>! 🌳&rdquo;
                </>
              ) : (
                'Bagikan dampak iklimmu ke teman dan keluarga.'
              )}
            </p>

            <p className="text-[10px] font-bold text-gray-400 mb-4">
              #TunasAction &nbsp; #ClimateHero
            </p>

            <div className="flex flex-wrap gap-3">
              <ShareButtons impact={impact} />
            </div>
          </article>
        </RevealGrid>
      </div>
    </div>
  );
};

export default ImpactPage;
