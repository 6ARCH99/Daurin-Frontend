import { Link, useLocation } from 'react-router-dom';
import LogoDaurin from '../assets/Logo Daurin.jpeg';

const Navbar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'HOME', path: '/home' },
    { name: 'REWARD', path: '/reward' },
    { name: 'CHALLENGE', path: '/challenge' },
    { name: 'IMPACT', path: '/impact' },
    { name: 'DROP POINT', path: '/drop-point' },
    { name: 'PENJEMPUTAN', path: '/penjemputan' },
  ];

  const isPathActive = (path) => location.pathname === path;

  return (
    <nav className="animate-nav fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 lg:px-10 border-b border-gray-200/50 bg-[#F5F5F0]/95 backdrop-blur-md z-[100]">
      <Link to="/home" className="flex items-center gap-3 group shrink-0">
        <div className="h-10 w-10 rounded-full bg-[#1A3022] flex items-center justify-center overflow-hidden border-2 border-[#1A3022] group-hover:scale-105 transition-transform shadow-sm">
          <img src={LogoDaurin} alt="Daurin" className="h-full w-full object-cover" />
        </div>
        <h1 className="type-brand text-[#1A3022] flex items-center">
          Daurin
          <span className="text-orange-500">.</span>
        </h1>
      </Link>

      <div className="hidden lg:flex gap-8 type-nav">
        {menuItems.map((item) => {
          const isActive = isPathActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`relative py-1 transition-colors ${
                isActive ? 'text-[#1A3022]' : 'text-gray-400 hover:text-[#1A3022]'
              }`}
            >
              {item.name}
              <span
                className={`absolute -bottom-1 left-0 w-full h-[2px] bg-[#1A3022] transition-transform origin-left ${
                  isActive ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {[
          { to: '/leaderboard', icon: '🏆', match: '/leaderboard' },
          { to: '/badges', icon: '🏅', match: '/badges' },
          { to: '/settings', icon: '⚙️', match: '/settings', prefix: true },
          { to: '/profile', icon: '👤', match: '/profile' },
        ].map(({ to, icon, match, prefix }) => {
          const active = prefix
            ? location.pathname.startsWith(match)
            : isPathActive(match);
          return (
            <Link
              key={to}
              to={to}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white btn-motion shadow-sm ${
                active ? 'bg-[#2D6A4F]' : 'bg-[#1A3022] hover:bg-[#2D4A37]'
              } ${to === '/profile' && active ? 'ring-2 ring-offset-2 ring-[#2D6A4F]' : ''}`}
            >
              <span className="text-base">{icon}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
