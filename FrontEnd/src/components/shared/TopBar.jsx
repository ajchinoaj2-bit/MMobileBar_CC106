import { useNavigate } from 'react-router-dom';
import { FaCog, FaUserCircle } from 'react-icons/fa';
import { getCurrentUser } from '../../utils/auth';
import NotificationBell from './NotificationBell';

export default function TopBar({ title, subtitle }) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const recipient = user?.role === 'owner' ? 'owner' : user?.fullname;

  const handleSettingsClick = () => {
    const currentUser = getCurrentUser();
    if (currentUser?.role === 'client') {
      navigate('/client/settings');
    }
  };

  return (
    <div className="h-25 bg-white border-b flex items-center justify-between px-6">
      <div>
        {title && <h1 className="text-4xl font-bold text-green-700 leading-tight">{title}</h1>}
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {recipient && <NotificationBell recipient={recipient} />}
        <button onClick={handleSettingsClick} className="text-gray-500 hover:text-gray-700 text-lg">
          <FaCog />
        </button>
        <button className="text-blue-600 hover:text-blue-700 text-2xl">
          <FaUserCircle />
        </button>
      </div>
    </div>
  );
}