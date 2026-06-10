const AchievementCard = ({ title, desc, date, icon }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-50 flex items-center gap-4 card-interactive">
    <div className="w-12 h-12 bg-tunas-bg rounded-full flex items-center justify-center text-xl">
      {icon}
    </div>
    <div>
      <p className="font-bold text-tunas-dark text-sm leading-tight">{title}</p>
      <p className="text-[10px] text-gray-400 mb-1">{desc}</p>
      <p className="text-[9px] font-bold text-gray-300 uppercase">{date}</p>
    </div>
  </div>
);

export default AchievementCard;