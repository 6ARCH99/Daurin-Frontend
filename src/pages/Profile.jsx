import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import AchievementCard from '../components/AchievementCard';
import EditProfileModal from '../components/EditProfileModal.jsx';
import { api, getImageUrl } from '../services/api.js';
import Icon from '../components/Icon.jsx';

const Profile = ({ user, onUserUpdate }) => {
  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [activities, setActivities] = useState([]);

  const loadProfileData = () => {
    return Promise.all([
      api.getProfile(),
      api.getProfileStats(),
      api.getProfileBadges(),
      api.getProfileActivities(),
    ]).then(([p, s, b, a]) => {
      setProfile(p.data);
      setStats(s.data);
      setBadges(b.data);
      setActivities(a.data);
    });
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleProfileSaved = (updated) => {
    setProfile(updated);
    onUserUpdate?.({
      id: updated.id,
      name: updated.fullName,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
    });
  };

  const userData = profile
    ? {
        name: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        location: profile.address,
        memberSince: new Date(profile.memberSince).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }).toUpperCase(),
        contributorRank: profile.rank?.toUpperCase() ?? 'MEMBER',
        verified: profile.verified,
      }
    : user
      ? {
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.address,
          memberSince: 'JAN 2026',
          contributorRank: 'TOP 12%',
          verified: true,
        }
      : {
          name: 'Putra Wijaya',
          email: 'putra.wijaya@email.com',
          phone: '+62 812-3456-7890',
          location: 'Kelapa Gading, Jakarta Utara',
          memberSince: 'JAN 2026',
          contributorRank: 'TOP 12%',
          verified: true,
        };

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans pb-20 pt-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-[32px] p-8 mb-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E9F5EF] rounded-bl-full opacity-20 -z-0" />

          <div className="relative z-10">
            <div className="w-28 h-28 bg-[#2D4A37] rounded-3xl flex items-center justify-center overflow-hidden shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              {profile?.profilePhotoUrl ? (
                <img src={getImageUrl(profile.profilePhotoUrl)} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-4xl font-bold font-heading">{userData.name.charAt(0)}</span>
              )}
            </div>
          </div>

          <div className="flex-1 z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-3xl font-bold text-[#1A3022] font-heading mb-2">{userData.name}</h2>
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-gray-500 text-sm">
                    <Icon name="mail" size={14} className="text-gray-400 flex-shrink-0" ariaHidden={true} />
                    {userData.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-500 text-sm">
                    <Icon name="phone" size={14} className="text-gray-400 flex-shrink-0" ariaHidden={true} />
                    {userData.phone}
                  </p>
                  <p className="flex items-center gap-2 text-gray-500 text-sm">
                    <Icon name="mapPin" size={14} className="text-gray-400 flex-shrink-0" ariaHidden={true} />
                    {userData.location}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="bg-[#1A3022] text-white px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-[#2d4a37] transition-all hover:shadow-lg active:scale-95 self-start min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                aria-label="Edit Profile"
              >
                <Icon name="edit" size={16} ariaHidden={true} />
                Edit Profile
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
              <span className="bg-[#E9F5EF] text-[#2D4A37] px-4 py-1.5 rounded-xl text-[10px] font-extrabold tracking-wider border border-[#CDE5D9]">
                MEMBER SEJAK {userData.memberSince}
              </span>
              <span className="bg-[#FEF6E0] text-[#D99A29] px-4 py-1.5 rounded-xl text-[10px] font-extrabold tracking-wider border border-[#F9E8BD]">
                {userData.contributorRank} CONTRIBUTOR
              </span>
              {userData.verified && (
                <span className="bg-[#E6F0FF] text-[#3377FF] px-4 py-1.5 rounded-xl text-[10px] font-extrabold tracking-wider border border-[#CCE0FF] flex items-center gap-1">
                  ✓ VERIFIED
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Setor" value={stats ? `${stats.totalWeightKg} kg` : '—'} icon="scale" color="bg-white" />
          <StatsCard title="Poin Terkumpul" value={stats ? stats.totalPoints.toLocaleString('id-ID') : '—'} icon="star" color="bg-white" />
          <StatsCard title="Challenges" value={stats ? String(stats.challengesCompleted) : '—'} icon="target" color="bg-white" />
          <StatsCard title="Hari Aktif" value={stats ? String(stats.activeDays) : '—'} icon="calendar" color="bg-white" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#FEF6E0] rounded-xl flex items-center justify-center">
                  <Icon name="trophy" size={22} className="text-[#D99A29]" ariaHidden={true} />
                </div>
                <h3 className="font-bold text-xl text-[#1A3022] font-heading">Pencapaian Terbaru</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map((b) => (
                  <AchievementCard
                    key={b.id}
                    title={b.name}
                    desc={b.description}
                    date={new Date(b.earnedAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    icon={b.icon}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-[#1A3022] font-heading">Aktivitas Terakhir</h3>
              </div>
              <div className="space-y-3">
                {activities.map((act) => {
                  const isMinus = act.pointsDelta < 0;
                  const getActivityIcon = () => {
                    if (act.type === 'deposit') return { name: 'package', color: 'text-[#2D4A37]' };
                    if (act.type === 'redemption') return { name: 'gift', color: 'text-[#D99A29]' };
                    return { name: 'target', color: 'text-[#2D6A4F]' };
                  };
                  const icon = getActivityIcon();
                  
                  return (
                    <div key={act.id} className="flex items-center justify-between p-3 bg-[#F9F9F6] border border-gray-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isMinus ? 'bg-[#FFF0ED]' : 'bg-white shadow-sm'}`}>
                          <Icon name={icon.name} size={18} className={icon.color} ariaHidden={true} />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-[#1A3022]">{act.title}</p>
                          <p className="text-[9px] text-gray-400">{act.description}</p>
                        </div>
                      </div>
                      <span className={`text-[11px] font-black ${isMinus ? 'text-red-500' : 'text-[#2D4A37]'}`}>
                        {act.pointsDelta > 0 ? '+' : ''}{act.pointsDelta}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        onSaved={handleProfileSaved}
      />
    </div>
  );
};

export default Profile;
