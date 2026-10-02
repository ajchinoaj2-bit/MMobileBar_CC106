import { useRef, useState } from 'react';
import { FaCamera, FaTimes, FaUserCircle, FaLock, FaSave } from 'react-icons/fa';
import {
  getCurrentUser,
  updateProfile,
  changePassword,
  validateProfileUpdate,
  validateNewPassword,
} from '../../utils/auth';

// Crops to a square and shrinks the photo so it doesn't eat localStorage space.
function resizeImage(file, size = 128) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the image.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not a valid image.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        canvas.getContext('2d').drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfileModal({ onClose, onSaved }) {
  const user = getCurrentUser();
  const fileRef = useRef(null);

  const [profile, setProfile] = useState({
    fullname: user?.fullname || '',
    username: user?.username || '',
    email: user?.email || '',
  });
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwMessage, setPwMessage] = useState('');

  const handleChange = (field) => (e) => {
    setProfile({ ...profile, [field]: e.target.value });
    setMessage('');
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      setAvatar(await resizeImage(file));
      setMessage('');
    } catch (err) {
      setErrors({ ...errors, avatar: err.message });
    }
  };

  const handleSave = () => {
    const found = validateProfileUpdate(profile, user.email);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setErrors({});
    updateProfile({ ...profile, avatar });
    setMessage('Profile updated successfully.');
    onSaved?.();
  };

  const handlePasswordSave = () => {
    const found = validateNewPassword(pw.next, pw.confirm);
    if (!pw.current) found.current = 'Enter your current password.';
    if (Object.keys(found).length > 0) {
      setPwErrors(found);
      setPwMessage('');
      return;
    }

    const result = changePassword(pw.current, pw.next);
    if (!result.success) {
      setPwErrors({ current: result.error });
      setPwMessage('');
      return;
    }

    setPwErrors({});
    setPw({ current: '', next: '', confirm: '' });
    setPwMessage('Password changed successfully.');
  };

  const inputClass = 'w-full mt-1 border rounded px-3 py-2 text-sm outline-none focus:border-green-600';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="bg-green-700 text-white px-6 py-4 flex items-start justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Account Profile</h2>
            <p className="text-sm text-green-100">Manage your account information and security.</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-green-200" aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center shrink-0">
            <div className="relative">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-28 h-28 rounded-full object-cover border" />
              ) : (
                <FaUserCircle className="w-28 h-28 text-gray-300" />
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 bg-gray-700 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-800"
                aria-label="Change photo"
              >
                <FaCamera className="text-xs" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </div>
            {errors.avatar && <p className="text-red-500 text-xs mt-2 max-w-[8rem] text-center">{errors.avatar}</p>}
          </div>

          <div className="flex-1 space-y-3">
            <p className="text-xs font-bold tracking-wide text-green-700">PERSONAL INFORMATION</p>

            <div>
              <label className="text-xs text-gray-500">Full Name</label>
              <input type="text" value={profile.fullname} onChange={handleChange('fullname')} className={inputClass} />
              {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
            </div>

            <div>
              <label className="text-xs text-gray-500">Username</label>
              <input type="text" value={profile.username} onChange={handleChange('username')} className={inputClass} />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="text-xs text-gray-500">Email Address</label>
              <input type="email" value={profile.email} onChange={handleChange('email')} className={inputClass} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              <p className="text-[10px] text-gray-400 mt-1">Changing your email changes what you log in with.</p>
            </div>

            <div>
              <label className="text-xs text-gray-500">Role</label>
              <input
                type="text"
                value={user?.role === 'owner' ? 'Owner' : 'Client'}
                disabled
                className="w-full mt-1 border rounded px-3 py-2 text-sm bg-gray-100 text-gray-500"
              />
            </div>

            {message && <p className="text-green-700 text-xs">{message}</p>}
          </div>
        </div>

        {showPassword && (
          <div className="px-6 pb-4">
            <div className="border-t pt-4 space-y-3">
              <p className="text-xs font-bold tracking-wide text-green-700">CHANGE PASSWORD</p>

              <div>
                <label className="text-xs text-gray-500">Current Password</label>
                <input
                  type="password"
                  value={pw.current}
                  onChange={(e) => setPw({ ...pw, current: e.target.value })}
                  className={inputClass}
                />
                {pwErrors.current && <p className="text-red-500 text-xs mt-1">{pwErrors.current}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">New Password</label>
                  <input
                    type="password"
                    value={pw.next}
                    onChange={(e) => setPw({ ...pw, next: e.target.value })}
                    placeholder="8+ characters, letters and numbers"
                    className={inputClass}
                  />
                  {pwErrors.next && <p className="text-red-500 text-xs mt-1">{pwErrors.next}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-500">Confirm New Password</label>
                  <input
                    type="password"
                    value={pw.confirm}
                    onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                    className={inputClass}
                  />
                  {pwErrors.confirm && <p className="text-red-500 text-xs mt-1">{pwErrors.confirm}</p>}
                </div>
              </div>

              {pwMessage && <p className="text-green-700 text-xs">{pwMessage}</p>}

              <button
                type="button"
                onClick={handlePasswordSave}
                className="bg-green-700 text-white text-sm px-4 py-2 rounded hover:bg-green-800"
              >
                Update Password
              </button>
            </div>
          </div>
        )}

        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center gap-2 border border-gray-400 text-gray-800 text-sm px-4 py-2 rounded hover:bg-gray-50"
          >
            <FaLock className="text-xs" /> Change Password
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-700 text-white text-sm px-4 py-2 rounded hover:bg-green-800"
          >
            <FaSave className="text-xs" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}