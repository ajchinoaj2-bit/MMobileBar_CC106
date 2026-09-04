import { NavLink } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaBoxOpen, FaUsers, FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/images/Mlogo.png';

const navItems = [
  { name: 'Dashboard', path: '/owner/dashboard', icon: <FaHome /> },
  { name: 'Bookings', path: '/owner/bookings', icon: <FaCalendarAlt /> },
  { name: 'Package', path: '/owner/package', icon: <FaBoxOpen /> },
  { name: 'Clients', path: '/owner/clients', icon: <FaUsers /> },
  { name: 'Payment management', path: '/owner/payments', icon: <FaMoneyBillWave /> },
];

export default function Sidebar() {
  return (
    <aside className="w-60 h-screen bg-[#0d1f14] text-white flex flex-col justify-between fixed left-0 top-0">
      <div>
        <div className="flex flex-col items-center py-6">
          <img src={logo} alt="M Mobile Bar" className="w-14 h-14" />
          <span className="text-green-400 font-bold mt-2">M Mobile Bar</span>
        </div>

        <nav className="mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-[#14301d]'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <button className="flex items-center gap-3 px-6 py-4 text-sm text-gray-300 hover:bg-[#14301d]">
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}