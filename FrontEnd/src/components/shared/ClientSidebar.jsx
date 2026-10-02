import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaClipboardList, FaHistory, FaSignOutAlt, FaComments } from 'react-icons/fa';
import logo from '../../assets/images/Mlogo.png';
import { logout } from '../../utils/auth';

const navItems = [
  { name: 'Dashboard', path: '/client/dashboard', icon: <FaHome /> },
  { name: 'Package', path: '/client/package', icon: <FaBoxOpen /> },
  { name: 'Booking Form', path: '/client/booking-form', icon: <FaClipboardList /> },
  { name: 'Booking History', path: '/client/booking-history', icon: <FaHistory /> },
  { name: 'Messages', path: '/client/messages', icon: <FaComments /> },
];

export default function ClientSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-60 h-screen bg-bottle-900 text-ivory-50 flex flex-col justify-between fixed left-0 top-0">
      <div>
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

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-4 text-sm text-ivory-100/70 hover:bg-forest-700/30 hover:text-ivory-50 transition-colors"
      >
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}