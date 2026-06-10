const RewardCard = ({ amount, points, isLocked, onRedeem, loading }) => (
  <button
    type="button"
    disabled={isLocked || loading}
    onClick={onRedeem}
    className={`w-full text-left p-6 rounded-2xl border btn-motion ${
      isLocked
        ? 'bg-gray-50/80 border-gray-100 cursor-not-allowed'
        : 'bg-white border-gray-100 shadow-sm card-interactive cursor-pointer hover:border-[#1A3022]/30'
    }`}
  >
    <div className="flex justify-between items-start mb-2">
      <p
        className={`font-display text-[1.35rem] font-semibold tracking-tight leading-tight ${
          isLocked ? 'text-gray-400' : 'text-[#1A3022]'
        }`}
      >
        {amount}
      </p>
      {isLocked && (
        <span className="font-sans text-[10px] font-bold uppercase tracking-wide text-gray-400">Terkunci</span>
      )}
    </div>
    <p className={`font-sans text-sm font-semibold ${isLocked ? 'text-gray-400' : 'text-[#5B9A74]'}`}>
      {points} poin
    </p>
  </button>
);

export default RewardCard;
