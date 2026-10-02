import { useState } from 'react';
import { FaCog, FaUserCircle } from 'react-icons/fa';
import { getCurrentUser } from '../../utils/auth';
import { isNotificationsEnabled } from '../../utils/settings';
import NotificationBell from './NotificationBell';
import ProfileModal from './ProfileModal';
import SettingsModal from './SettingsModal';

export default function TopBar({ title, subtitle }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);

  const user = getCurrentUser();
  const recipient = user?.role === 'owner' ? 'owner' : user?.fullname;
  const showBell = recipient && isNotificationsEnabled(recipient);

  return (
    <div className="h-25 bg-ivory-50 border-b border-brass-100 flex items-center justify-between px-6">
      <div>
        {title && (
          <h1 className="font-display text-4xl font-semibold text-bottle-900 leading-tight">
            {title}
          </h1>
        )}
        {subtitle && <p className="text-sm text-charcoal-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {showBell && <NotificationBell recipient={recipient} />}

        <button
          onClick={() => setShowSettings(true)}
          className="text-charcoal-500 hover:text-forest-700 text-lg transition-colors"
          title="System Settings"
        >
          <FaCog />
        </button>

        <button
          onClick={() => setShowProfile(true)}
          className="text-forest-700 hover:text-brass-600 text-2xl transition-colors"
          title="Account Profile"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-brass-400"
            />
          ) : (
            <FaUserCircle />
          )}
        </button>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onSaved={refresh} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} onSaved={refresh} />}
    </div>
  );
}