const ProfileCard = () => (
  <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm mb-8 card-interactive">
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      {/* Avatar */}
      <div className="relative">
        <div className="w-24 h-24 bg-[#1B3C35] rounded-full flex items-center justify-center text-white text-4xl font-bold">
          U
        </div>
        <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-100 shadow-sm">
          <div className="bg-green-100 text-green-600 p-1 rounded-full text-[10px]">🌱</div>
        </div>
      </div>

      {/* Info User */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-tunas-dark">Putra Wijaya</h2>
            <p className="text-gray-400 text-sm">putra.wijaya@email.com • +62 812-3456-7890</p>
            <p className="text-gray-400 text-sm italic">📍 Kelapa Gading, Jakarta Utara</p>
          </div>
          <button className="border border-gray-200 text-tunas-dark px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-50 self-center md:self-start">
            ✏️ Edit Profile
          </button>
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          <span className="bg-green-50 text-tunas-green px-3 py-1 rounded-full text-[10px] font-bold border border-green-100">Member sejak Jan 2026</span>
          <span className="bg-green-50 text-tunas-green px-3 py-1 rounded-full text-[10px] font-bold border border-green-100">Top 12% Contributor</span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-100">Verified</span>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileCard;