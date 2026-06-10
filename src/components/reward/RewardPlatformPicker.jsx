const PLATFORMS = [
  { id: 'gopay', label: 'GoPay' },
  { id: 'ovo', label: 'OVO' },
  { id: 'dana', label: 'Dana' },
  { id: 'shopeepay', label: 'ShopeePay' },
];

const RewardPlatformPicker = ({ value, onChange }) => (
  <div>
    <h3 className="font-display text-lg font-semibold text-[#1A3022] tracking-tight mb-4">Pilih Platform</h3>
    <div className="grid grid-cols-2 gap-3">
      {PLATFORMS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onChange(p.id)}
          className={`text-left p-5 rounded-2xl border transition-all ${
            value === p.id
              ? 'border-[#1A3022] bg-white ring-1 ring-[#1A3022]'
              : 'border-gray-100 bg-white hover:border-gray-200'
          }`}
        >
          <p className="font-sans text-sm font-semibold text-[#1A3022]">{p.label}</p>
          <p className="font-sans text-xs font-normal text-gray-400 mt-1">Proses instan</p>
        </button>
      ))}
    </div>
  </div>
);

export default RewardPlatformPicker;
export { PLATFORMS };
