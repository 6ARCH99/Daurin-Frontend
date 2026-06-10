const StatsCard = ({ title, value, icon, sub, progress, trend }) => (
  <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-50 card-interactive">
    <div className="flex justify-between items-start mb-5">
      <span className="type-label">{title}</span>
      <span className="text-2xl leading-none" aria-hidden>
        {icon}
      </span>
    </div>
    <div className="type-stat-value mb-3 min-h-[2.5rem] animate-stat">{value ?? '—'}</div>
    {typeof progress === 'number' ? (
      <>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#6BA67E] h-full transition-all duration-1000 animate-progress-bar"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        {sub ? <p className="type-caption mt-2">{sub}</p> : null}
      </>
    ) : sub ? (
      <p className={`type-caption-bold ${trend ? 'text-[#2D6A4F]' : 'text-gray-400'}`}>{sub}</p>
    ) : null}
  </div>
);

export default StatsCard;
