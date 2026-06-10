import { useEffect, useState } from 'react';
import { CreditCard, ChevronDown } from 'lucide-react';
import { api } from '../../services/api';
import { PLATFORMS } from './RewardPlatformPicker';

const RewardEwalletForm = ({ platform, onPlatformChange, wallet, onSaved }) => {
  const [phone, setPhone] = useState(wallet?.phone || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (wallet?.phone) setPhone(wallet.phone);
  }, [wallet?.phone]);

  const selected = PLATFORMS.find((p) => p.id === platform);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await api.saveEwallet(platform, phone);
      setMsg('E-wallet disimpan.');
      onSaved?.();
    } catch (err) {
      setMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-6 md:p-8 shadow-sm">
      <h3 className="font-display text-lg font-semibold text-[#1A3022] tracking-tight mb-1 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-[#1A3022] shrink-0" strokeWidth={2} />
        Informasi E-Wallet untuk Pencairan
      </h3>
      <p className="font-sans text-sm font-normal text-gray-500 mb-6">
        Tambahkan atau perbarui nomor e-wallet untuk menerima reward
      </p>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Pilih E-Wallet *
            </label>
            <div className="relative">
              <select
                value={platform}
                onChange={(e) => onPlatformChange?.(e.target.value)}
                className="w-full appearance-none p-4 pr-10 bg-[#F9F9F6] rounded-xl font-sans text-sm font-semibold text-[#1A3022] border border-gray-100 capitalize cursor-pointer"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Nomor {selected?.label} *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789"
                className="w-full pl-11 pr-4 py-4 bg-[#F9F9F6] rounded-xl font-sans text-sm font-normal text-[#1A3022] border border-gray-100 outline-none focus:ring-2 focus:ring-[#1A3022]/10"
              />
            </div>
          </div>
        </div>
        <p className="font-sans text-xs font-medium text-[#2D6A4F]">
          ✓ Pastikan nomor e-wallet sudah aktif dan terdaftar atas namamu
        </p>
        {msg && <p className="font-sans text-xs text-gray-600">{msg}</p>}
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1A3022] text-white px-6 py-3 rounded-xl font-sans text-xs font-semibold disabled:opacity-50"
        >
          {saving ? 'Menyimpan…' : 'Simpan E-Wallet'}
        </button>
      </form>
    </div>
  );
};

export default RewardEwalletForm;
