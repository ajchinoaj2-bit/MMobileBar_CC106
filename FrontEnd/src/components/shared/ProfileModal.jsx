
import { useRef, useState } from 'react';
import {
  FaCamera,
  FaTimes,
  FaUserCircle,
  FaLock,
  FaSave,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

import {
  getCurrentUser,
  updateProfile,
  changePassword,
  validateProfileUpdate,
  validateNewPassword,
} from '../../utils/auth';

// Resize the uploaded image to reduce localStorage usage.
function resizeImage(file, size = 128) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Could not read the image.'));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('That file is not a valid image.'));
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext('2d');

        if (!context) {
          reject(new Error('Could not process the image.'));
          return;
        }

        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;

        context.drawImage(
          img,
          sx,
          sy,
          side,
          side,
          0,
          0,
          size,
          size
        );

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

// Password field with its own anchored eye button.
function PasswordField({
  label,
  value,
  onChange,
  error,
  placeholder,
  autoComplete = 'off',
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full min-w-0">
      <label className="block text-xs text-gray-500">
        {label}
      </label>

      <div className="relative mt-1 w-full min-w-0">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="block box-border w-full min-w-0 rounded border border-gray-300 bg-white py-2 pl-3 pr-12 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
        />

        <button
          type="button"
          onClick={() => setShow((previous) => !previous)}
          aria-label={show ? 'Hide password' : 'Show password'}
          title={show ? 'Hide password' : 'Show password'}
          className="absolute right-0 top-0 flex h-full w-10 items-center justify-center rounded-r text-gray-500 hover:bg-gray-50 hover:text-green-700 focus:outline-none"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {error && (
        <p className="mt-1 break-words text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
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

  const [pw, setPw] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  const [pwErrors, setPwErrors] = useState({});
  const [pwMessage, setPwMessage] = useState('');

  const inputClass =
    'mt-1 block box-border w-full min-w-0 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600';

  const handleChange = (field) => (e) => {
    setProfile((previous) => ({
      ...previous,
      [field]: e.target.value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: '',
    }));

    setMessage('');
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];

    // Allow selecting the same image again.
    e.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((previous) => ({
        ...previous,
        avatar: 'Please select an image file.',
      }));
      return;
    }

    try {
      const resizedImage = await resizeImage(file);

      setAvatar(resizedImage);

      setErrors((previous) => ({
        ...previous,
        avatar: '',
      }));

      setMessage('');
    } catch (error) {
      setErrors((previous) => ({
        ...previous,
        avatar: error.message || 'Unable to upload this image.',
      }));
    }
  };

  const handleSave = () => {
    const found = validateProfileUpdate(
      profile,
      user?.email || ''
    );

    if (Object.keys(found).length > 0) {
      setErrors((previous) => ({
        ...previous,
        ...found,
      }));
      setMessage('');
      return;
    }

    try {
      updateProfile({
        ...profile,
        avatar,
      });

      setErrors({});
      setMessage('Profile updated successfully.');
      onSaved?.();
    } catch {
      setMessage('Unable to save your profile. Please try again.');
    }
  };

  const handlePasswordSave = () => {
    const found = validateNewPassword(
      pw.next,
      pw.confirm
    );

    if (!pw.current) {
      found.current = 'Enter your current password.';
    }

    if (Object.keys(found).length > 0) {
      setPwErrors(found);
      setPwMessage('');
      return;
    }

    const result = changePassword(pw.current, pw.next);

    if (!result.success) {
      setPwErrors({
        current: result.error || 'Unable to change password.',
      });
      setPwMessage('');
      return;
    }

    setPwErrors({});
    setPw({
      current: '',
      next: '',
      confirm: '',
    });
    setPwMessage('Password changed successfully.');
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="my-auto flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-3 bg-green-700 px-4 py-4 text-white sm:px-6">
          <div className="min-w-0">
            <h2
              id="profile-modal-title"
              className="text-lg font-bold sm:text-xl"
            >
              Account Profile
            </h2>

            <p className="mt-1 text-xs text-green-100 sm:text-sm">
              Manage your account information and security.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close profile"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-green-800"
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="flex flex-col gap-6 p-4 sm:flex-row sm:items-start sm:p-6">
            {/* Profile photo */}
            <div className="flex shrink-0 flex-col items-center">
              <div className="relative">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border border-gray-200 object-cover sm:h-28 sm:w-28"
                  />
                ) : (
                  <FaUserCircle className="h-24 w-24 text-gray-300 sm:h-28 sm:w-28" />
                )}

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  aria-label="Change profile photo"
                  title="Change photo"
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-white shadow hover:bg-gray-800"
                >
                  <FaCamera className="text-sm" />
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatar}
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Profile photo
              </p>

              {errors.avatar && (
                <p className="mt-1 max-w-36 break-words text-center text-xs text-red-500">
                  {errors.avatar}
                </p>
              )}
            </div>

            {/* Personal information */}
            <div className="min-w-0 flex-1 space-y-4">
              <p className="text-xs font-bold tracking-wide text-green-700">
                PERSONAL INFORMATION
              </p>

              <div>
                <label className="block text-xs text-gray-500">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullname}
                  onChange={handleChange('fullname')}
                  className={inputClass}
                  autoComplete="name"
                />
                {errors.fullname && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.fullname}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500">
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={handleChange('username')}
                  className={inputClass}
                  autoComplete="username"
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={handleChange('email')}
                  className={inputClass}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email}
                  </p>
                )}
                <p className="mt-1 text-[10px] text-gray-400">
                  Changing your email changes what you log in with.
                </p>
              </div>

              <div>
                <label className="block text-xs text-gray-500">
                  Role
                </label>
                <input
                  type="text"
                  value={user?.role === 'owner' ? 'Owner' : 'Client'}
                  disabled
                  className={`${inputClass} bg-gray-100 text-gray-500`}
                />
              </div>

              {message && (
                <p
                  role="status"
                  className={`break-words text-xs ${
                    message.includes('successfully')
                      ? 'text-green-700'
                      : 'text-red-500'
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Change password section */}
          {showPassword && (
            <div className="px-4 pb-5 sm:px-6">
              <div className="space-y-4 border-t border-gray-200 pt-5">
                <div>
                  <h3 className="text-xs font-bold tracking-wide text-green-700">
                    CHANGE PASSWORD
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your current password before choosing a new one.
                  </p>
                </div>

                <PasswordField
                  label="Current Password"
                  value={pw.current}
                  onChange={(e) => {
                    setPw((previous) => ({
                      ...previous,
                      current: e.target.value,
                    }));
                    setPwErrors((previous) => ({
                      ...previous,
                      current: '',
                    }));
                    setPwMessage('');
                  }}
                  error={pwErrors.current}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <PasswordField
                    label="New Password"
                    value={pw.next}
                    onChange={(e) => {
                      setPw((previous) => ({
                        ...previous,
                        next: e.target.value,
                      }));
                      setPwErrors((previous) => ({
                        ...previous,
                        next: '',
                      }));
                      setPwMessage('');
                    }}
                    error={pwErrors.next}
                    placeholder="8+ characters, letters and numbers"
                    autoComplete="new-password"
                  />

                  <PasswordField
                    label="Confirm New Password"
                    value={pw.confirm}
                    onChange={(e) => {
                      setPw((previous) => ({
                        ...previous,
                        confirm: e.target.value,
                      }));
                      setPwErrors((previous) => ({
                        ...previous,
                        confirm: '',
                      }));
                      setPwMessage('');
                    }}
                    error={pwErrors.confirm}
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                  />
                </div>

                {pwMessage && (
                  <p
                    role="status"
                    className={`text-xs ${
                      pwMessage.includes('successfully')
                        ? 'text-green-700'
                        : 'text-red-500'
                    }`}
                  >
                    {pwMessage}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handlePasswordSave}
                  className="w-full rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800 sm:w-auto"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fixed footer */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-expanded={showPassword}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 sm:w-auto"
          >
            <FaLock className="shrink-0 text-xs" />
            {showPassword ? 'Hide Password Section' : 'Change Password'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800 sm:w-auto"
          >
            <FaSave className="shrink-0 text-xs" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
