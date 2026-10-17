
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaCalendarAlt,
  FaBoxOpen,
  FaUsers,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaTimes,
} from 'react-icons/fa';

import logo from '../../assets/images/Mlogo.png';
import { logout } from '../../utils/auth';

const navItems = [
  { name: 'Dashboard', path: '/owner/dashboard', icon: <FaHome /> },
  { name: 'Bookings', path: '/owner/bookings', icon: <FaCalendarAlt /> },
  { name: 'Package', path: '/owner/package', icon: <FaBoxOpen /> },
  { name: 'Clients', path: '/owner/clients', icon: <FaUsers /> },
  {
    name: 'Payment Management',
  path: '/owner/payments',
  icon: <FaMoneyBillWave />,
},
];

export default function Sidebar({ open, onClose }) {
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
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen h-[100dvh] w-60 flex-col overflow-hidden bg-bottle-900 text-ivory-50 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Mobile menu header */}
        <div className="flex shrink-0 items-center justify-between px-4 pt-4 md:hidden">
          <span className="text-xs text-ivory-100/50">Menu</span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center text-ivory-100/70 hover:text-brass-400"
          >
            <FaTimes />
          </button>
        </div>

        {/* Logo */}
        <div className="flex shrink-0 flex-col items-center border-b border-forest-700/60 py-6">
          <img
            src={logo}
            alt="M Mobile Bar"
            className="h-14 w-14 object-contain"
          />

          <span className="mt-2 font-display text-lg font-semibold tracking-wide text-brass-500">
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
                `flex items-center gap-3 border-l-4 px-6 py-3 text-sm transition-colors ${
                  isActive
                    ? 'border-brass-500 bg-forest-700/60 font-medium text-brass-400'
                    : 'border-transparent text-ivory-100/70 hover:bg-forest-700/30 hover:text-ivory-50'
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="min-w-0 break-words">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Pinned logout footer */}
        <div className="mt-auto shrink-0 border-t border-brass-500/30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 md:pb-5">
          <button
            type="button"
            onClick={handleLogout}
            className="group w-full flex items-center gap-3 sm:gap-10 px-5 py-3 rounded-full border border-forest-700 text-base font-medium text-ivory-100/80 transition-all duration-200 hover:bg-forest-700/60 hover:border-brass-500 hover:text-brass-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/60 active:scale-[0.98]"
          >
            <FaSignOutAlt className="shrink-0 text-base transition-transform duration-200 group-hover:translate-x-0.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
