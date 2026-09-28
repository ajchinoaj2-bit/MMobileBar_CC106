import { useState } from 'react';
import { getCurrentUser, updateProfile, changePassword, validateProfileUpdate } from '../../utils/auth';

export default function AccountSettings() {
  const currentUser = getCurrentUser();

  const [profile, setProfile] = useState({
    fullname: currentUser?.fullname || '',
    username: currentUser?.username || '',
    email: currentUser?.email || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSaved, setProfileSaved] = useState(false);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleProfileChange = (field) => (e) => {
    setProfile({ ...profile, [field]: e.target.value });
    setProfileSaved(false);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const errors = validateProfileUpdate(profile, currentUser.email);
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }
    setProfileErrors({});
    updateProfile(currentUser.email, profile);
    setProfileSaved(true);
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswords({ ...passwords, [field]: e.target.value });
    setPasswordSaved(false);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    const errors = {};

    if (!passwords.current) errors.current = 'Enter your current password.';

    if (!passwords.new) {
      errors.new = 'New password is required.';
    } else if (/\s/.test(passwords.new)) {
      errors.new = 'Password cannot contain spaces.';
    } else if (passwords.new.length < 8) {
      errors.new = 'Password must be at least 8 characters.';
    } else if (!/[A-Za-z]/.test(passwords.new) || !/[0-9]/.test(passwords.new)) {
      errors.new = 'Password must include both letters and numbers.';
    }

    if (passwords.new !== passwords.confirm) {
      errors.confirm = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    const result = changePassword(currentUser.email, passwords.current, passwords.new);
    if (!result.success) {
      setPasswordErrors({ current: result.error });
      return;
    }

    setPasswordErrors({});
    setPasswords({ current: '', new: '', confirm: '' });
    setPasswordSaved(true);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="font-semibold text-green-700 mb-4">Profile Information</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Full Name</label>
              <input
                type="text"
                value={profile.fullname}
                onChange={handleProfileChange('fullname')}
                className="w-full mt-1 border rounded px-3 py-2 text-sm"
              />
              {profileErrors.fullname && <p className="text-red-500 text-xs mt-1">{profileErrors.fullname}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-500">Username</label>
              <input
                type="text"
                value={profile.username}
                onChange={handleProfileChange('username')}
                className="w-full mt-1 border rounded px-3 py-2 text-sm"
              />
              {profileErrors.username && <p className="text-red-500 text-xs mt-1">{profileErrors.username}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={handleProfileChange('email')}
              className="w-full mt-1 border rounded px-3 py-2 text-sm"
            />
            {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>}
            <p className="text-[10px] text-gray-400 mt-1">
              Changing your email changes what you log in with next time.
            </p>
          </div>

          {profileSaved && <p className="text-green-700 text-xs">Profile updated successfully.</p>}

          <button
            type="submit"
            className="bg-green-700 text-white text-sm px-5 py-2 rounded hover:bg-green-800"
          >
            Save Changes
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="font-semibold text-green-700 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500">Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={handlePasswordChange('current')}
              className="w-full mt-1 border rounded px-3 py-2 text-sm"
            />
            {passwordErrors.current && <p className="text-red-500 text-xs mt-1">{passwordErrors.current}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={handlePasswordChange('new')}
                placeholder="At least 8 characters, letters and numbers"
                className="w-full mt-1 border rounded px-3 py-2 text-sm"
              />
              {passwordErrors.new && <p className="text-red-500 text-xs mt-1">{passwordErrors.new}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-500">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={handlePasswordChange('confirm')}
                className="w-full mt-1 border rounded px-3 py-2 text-sm"
              />
              {passwordErrors.confirm && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirm}</p>}
            </div>
          </div>

          {passwordSaved && <p className="text-green-700 text-xs">Password changed successfully.</p>}

          <button
            type="submit"
            className="bg-green-700 text-white text-sm px-5 py-2 rounded hover:bg-green-800"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}