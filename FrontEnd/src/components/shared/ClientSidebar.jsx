import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaClipboardList, FaHistory, FaSignOutAlt, FaComments, FaTimes } from 'react-icons/fa';
import logo from '../../assets/images/Mlogo.png';
import { logout } from '../../utils/auth';

const navItems = [
  { name: 'Dashboard', path: '/client/dashboard', icon: <FaHome /> },
  { name: 'Package', path: '/client/package', icon: <FaBoxOpen /> },
  { name: 'Booking Form', path: '/client/booking-form', icon: <FaClipboardList /> },
  { name: 'Booking History', path: '/client/booking-history', icon: <FaHistory /> },
  { name: 'Messages', path: '/client/messages', icon: <FaComments /> },
];

export default function ClientSidebar({ open, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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
        className={`w-60 h-screen bg-bottle-900 text-ivory-50 flex flex-col justify-between fixed left-0 top-0 z-50 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div>
          <div className="flex items-center justify-between px-4 pt-4 md:hidden">
            <span className="text-ivory-100/50 text-xs">Menu</span>
            <button onClick={onClose} className="text-ivory-100/70 hover:text-brass-400">
              <FaTimes />
            </button>
          </div>

          <div className="flex flex-col items-center py-6 border-b border-forest-700/60">
            <img src={logo} alt="M Mobile Bar" className="w-14 h-14" />
            <span className="font-display text-brass-500 font-semibold text-lg mt-2 tracking-wide">
              M Mobile Bar
            </span>
          </div>

          <nav className="mt-4">
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
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout section */}
        <div className="pb-5">
          {/* Divider line */}
          <div className="border-t border-brass-500/30 mb-4" />

          <div className="px-4">
            <button
              onClick={handleLogout}
              className="group w-full flex items-center gap-10 px-5 py-3 rounded-full border border-forest-700 text-base font-medium text-ivory-100/80 transition-all duration-200 hover:bg-forest-700/60 hover:border-brass-500 hover:text-brass-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/60 active:scale-[0.98]"
            >
              <FaSignOutAlt className="text-base transition-transform duration-200 group-hover:translate-x-0.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}