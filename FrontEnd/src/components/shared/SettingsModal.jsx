import { useRef, useState } from 'react';
import {
  FaCog,
  FaTimes,
  FaBell,
  FaInfoCircle,
  FaDatabase,
  FaCloudDownloadAlt,
  FaUpload,
  FaSave,
} from 'react-icons/fa';
import { getCurrentUser } from '../../utils/auth';
import { getSettings, saveSettings } from '../../utils/settings';
import { createBackup, restoreBackup, getLastBackup } from '../../utils/backup';

export default function SettingsModal({ onClose, onSaved }) {
  const user = getCurrentUser();
  const isOwner = user?.role === 'owner';
  const recipient = isOwner ? 'owner' : user?.fullname;
  const restoreRef = useRef(null);

  const [notificationsOn, setNotificationsOn] = useState(getSettings(recipient).notificationsEnabled);
  const [lastBackup, setLastBackup] = useState(getLastBackup());
  const [status, setStatus] = useState('');

  const handleBackup = () => {
    setLastBackup(createBackup());
    setStatus('Backup downloaded.');
  };

  const handleRestore = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    const ok = window.confirm(
      'Restoring replaces the current bookings, packages, messages and notifications with the contents of this backup. Continue?'
    );
    if (!ok) return;

    restoreBackup(file)
      .then(() => {
        setStatus('Backup restored. Reloading...');
        setTimeout(() => window.location.reload(), 800);
      })
      .catch((err) => setStatus(err.message));
  };

  const handleSave = () => {
    saveSettings(recipient, { notificationsEnabled: notificationsOn });
    onSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-green-700 text-white px-6 py-4 flex items-start justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="bg-green-800 w-10 h-10 rounded-lg flex items-center justify-center">
              <FaCog />
            </div>
            <div>
              <h2 className="text-xl font-bold">System Settings</h2>
              <p className="text-sm text-green-100">Manage system preferences.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-green-200" aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Notifications */}
          <div className="flex items-center justify-between pb-5 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-700 w-10 h-10 rounded-lg flex items-center justify-center">
                <FaBell />
              </div>
              <div>
                <p className="font-semibold text-sm">Notifications</p>
                <p className="text-xs text-gray-500">Receive system notifications and alerts.</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notificationsOn}
              onClick={() => setNotificationsOn(!notificationsOn)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notificationsOn ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                  notificationsOn ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* About */}
          <div className={isOwner ? 'pb-5 border-b' : ''}>
            <div className="flex items-center gap-2 mb-3">
              <FaInfoCircle className="text-gray-500" />
              <p className="font-semibold text-sm">About System</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs">System</p>
                <p className="font-medium">M Mobile Bar</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Version</p>
                <p className="font-medium">1.0.0</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Database</p>
                <p className="font-medium">Local Storage</p>
              </div>
            </div>
          </div>

          {/* Backup (owner only) */}
          {isOwner && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaDatabase className="text-gray-500" />
                <p className="font-semibold text-sm">Backup Data</p>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Download a backup of bookings, packages, messages and notifications.
              </p>

              <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between gap-3">
                <p className="text-xs text-gray-600">Last Backup: {lastBackup || 'Never'}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => restoreRef.current?.click()}
                    className="flex items-center gap-2 border border-gray-400 text-gray-800 text-xs font-semibold px-3 py-2 rounded hover:bg-white"
                  >
                    <FaUpload /> Restore
                  </button>
                  <button
                    type="button"
                    onClick={handleBackup}
                    className="flex items-center gap-2 bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded hover:bg-green-800"
                  >
                    <FaCloudDownloadAlt /> Backup
                  </button>
                  <input ref={restoreRef} type="file" accept=".json" className="hidden" onChange={handleRestore} />
                </div>
              </div>

              {status && <p className="text-xs text-green-700 mt-2">{status}</p>}
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-green-800"
          >
            <FaSave className="text-xs" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}