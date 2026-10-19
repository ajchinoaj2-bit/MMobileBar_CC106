
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaHistory,
  FaSignOutAlt,
  FaComments,
  FaTimes,
} from 'react-icons/fa';
import logo from '../../assets/images/Mlogo.png';
import { logout } from '../../utils/auth';

const navItems = [
  { name: 'Dashboard', path: '/client/dashboard', icon: <FaHome /> },


  { name: 'Booking History', path: '/client/booking-history', icon: <FaHistory /> },
  { name: 'Messages', path: '/client/messages', icon: <FaComments /> },
];

export default function ClientSidebar({ open, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/');
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-60 h-screen h-[100dvh] bg-bottle-900 text-ivory-50 flex flex-col fixed left-0 top-0 z-50 overflow-hidden transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Mobile menu header */}
        <div className="flex items-center justify-between px-4 pt-4 shrink-0 md:hidden">
          <span className="text-ivory-100/50 text-xs">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-ivory-100/70 hover:text-brass-400"
          >
            <FaTimes />
          </button>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center py-6 border-b border-forest-700/60 shrink-0">
          <img src={logo} alt="M Mobile Bar" className="w-14 h-14" />
          <span className="font-display text-brass-500 font-semibold text-lg mt-2 tracking-wide">
            M Mobile Bar
          </span>
        </div>

        {/* Scrollable navigation */}
        <nav className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm transition-colors border-l-4 ${
                  isActive
                    ? 'bg-forest-700/60 border-brass-500 text-brass-400 font-medium'
                    : 'border-transparent text-ivory-100/70 hover:bg-forest-700/30 hover:text-ivory-50'
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout pinned to the bottom */}
        <div className="mt-auto shrink-0 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:pb-5">
          <div className="border-t border-brass-500/30 mb-4" />

          <div className="px-4">
            <button
              type="button"
              onClick={handleLogout}
              className="group w-full flex items-center gap-3 sm:gap-10 px-5 py-3 rounded-full border border-forest-700 text-base font-medium text-ivory-100/80 transition-all duration-200 hover:bg-forest-700/60 hover:border-brass-500 hover:text-brass-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/60 active:scale-[0.98]"
            >
              <FaSignOutAlt className="shrink-0 text-base transition-transform duration-200 group-hover:translate-x-0.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
