
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '../components/shared/Button';
import logo from '../assets/images/Mlogo.png';
import { login, resetPassword } from '../utils/auth';

export default function Login() {
  const [role, setRole] = useState('owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = login(email, password, role);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setError('');
    navigate(
      role === 'owner'
        ? '/owner/dashboard'
        : '/client/dashboard'
    );
  };

  const openForgotModal = () => {
    setForgotEmail(email);
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotError('');
    setForgotSuccess('');
    setShowForgotModal(true);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotError('');
    setForgotSuccess('');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();

    setForgotError('');
    setForgotSuccess('');

    const result = resetPassword(
      forgotEmail,
      role,
      newPassword,
      confirmNewPassword
    );

    if (!result.success) {
      setForgotError(result.error);
      return;
    }

    setForgotSuccess(result.message);
    setEmail(forgotEmail.trim().toLowerCase());
    setPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-bottle-950 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-4 sm:px-6 py-6 sm:py-8">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(201,169,97,0.12), transparent 45%), radial-gradient(circle at 80% 70%, rgba(42,77,56,0.35), transparent 50%)',
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-bottle-950/40 to-bottle-950" />

      {/* Brand */}
      <div className="relative flex flex-col items-center text-center w-full lg:w-auto shrink-0">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-brass-500/20 blur-2xl scale-125" />

          <img
            src={logo}
            alt="M Mobile Bar"
            className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40"
          />
        </div>

        <h1 className="font-display text-brass-500 text-3xl sm:text-4xl font-semibold mt-3 sm:mt-5 tracking-wide">
          M Mobile Bar
        </h1>

        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 max-w-full">
          <span className="h-px w-8 bg-brass-500/50" />

          <p className="text-ivory-100/50 text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.2em]">
            Event Bar &amp; Beverage Services
          </p>

          <span className="h-px w-8 bg-brass-500/50" />
        </div>
      </div>

      {/* Login Card */}
      <div className="relative bg-bottle-900/90 backdrop-blur border border-brass-500/20 rounded-xl p-5 sm:p-8 w-full max-w-sm shadow-[0_0_60px_-15px_rgba(201,169,97,0.25)]">
        <h2 className="font-display text-ivory-50 text-xl font-semibold">
          Welcome Back
        </h2>

        <p className="text-ivory-100/60 text-sm mb-4">
          Sign in to continue to your account
        </p>

        {/* Role Selection */}
        <div className="flex bg-bottle-950 border border-forest-700 rounded-lg p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setRole('owner');
              setError('');
            }}
            className={`flex-1 py-1.5 text-sm rounded transition-colors ${
              role === 'owner'
                ? 'bg-brass-500 text-bottle-900 font-medium'
                : 'text-ivory-100/50'
            }`}
          >
            Owner
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('client');
              setError('');
            }}
            className={`flex-1 py-1.5 text-sm rounded transition-colors ${
              role === 'client'
                ? 'bg-brass-500 text-bottle-900 font-medium'
                : 'text-ivory-100/50'
            }`}
          >
            Client
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-ivory-100/70 text-sm block mb-1">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full min-w-0 px-3 py-2 rounded bg-bottle-950 border border-forest-700 text-ivory-50 text-sm outline-none focus:border-brass-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-ivory-100/70 text-sm block mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full min-w-0 px-3 py-2 pr-10 rounded bg-bottle-950 border border-forest-700 text-ivory-50 text-sm outline-none focus:border-brass-500 transition-colors"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-100 hover:text-brass-400 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap justify-between items-center gap-3 text-xs text-ivory-100/60">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-brass-500"
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={openForgotModal}
              className="text-brass-400 hover:text-brass-300 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button type="submit" className="w-full">
            Log In as {role === 'owner' ? 'Owner' : 'Client'}
          </Button>

          {role === 'client' && (
            <p className="text-center text-xs text-ivory-100/60">
              Don't have an account?{' '}
              <Link
                to="/client/signup"
                className="text-brass-400 hover:text-brass-300 hover:underline"
              >
                Sign up
              </Link>
            </p>
          )}
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-bottle-900 border border-brass-500/30 rounded-xl shadow-2xl p-5 sm:p-6 w-full max-w-md max-h-[90dvh] overflow-y-auto my-auto">
            {forgotSuccess ? (
              <>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <FaEye className="text-green-400 text-xl" />
                </div>

                <h2 className="font-display text-ivory-50 text-xl font-semibold">
                  Password Reset Successful
                </h2>

                <p className="text-green-400 text-sm mt-3 mb-6">
                  {forgotSuccess}
                </p>

                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="w-full bg-brass-500 text-bottle-900 font-medium py-2.5 rounded-lg text-sm hover:bg-brass-600 transition-colors"
                >
                  Return to Login
                </button>
              </>
            ) : (
              <>
                <h2 className="font-display text-ivory-50 text-xl font-semibold">
                  Reset Password
                </h2>

                <p className="text-ivory-100/60 text-sm mt-2 mb-5">
                  Enter your registered email and choose a new password for
                  your {role === 'owner' ? 'Owner' : 'Client'} account.
                </p>

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="text-ivory-100/70 text-sm block mb-1">
                      Account Email
                    </label>

                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter registered email"
                      className="w-full min-w-0 px-3 py-2.5 rounded-lg bg-bottle-950 border border-forest-700 text-ivory-50 text-sm outline-none focus:border-brass-500"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-ivory-100/70 text-sm block mb-1">
                      New Password
                    </label>

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full min-w-0 px-3 py-2.5 rounded-lg bg-bottle-950 border border-forest-700 text-ivory-50 text-sm outline-none focus:border-brass-500"
                      autoComplete="new-password"
                      required
                    />

                    <p className="text-ivory-100/40 text-xs mt-1">
                      At least 8 characters, including letters and numbers,
                      with no spaces.
                    </p>
                  </div>

                  <div>
                    <label className="text-ivory-100/70 text-sm block mb-1">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) =>
                        setConfirmNewPassword(e.target.value)
                      }
                      placeholder="Re-enter new password"
                      className="w-full min-w-0 px-3 py-2.5 rounded-lg bg-bottle-950 border border-forest-700 text-ivory-50 text-sm outline-none focus:border-brass-500"
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  {forgotError && (
                    <p className="text-red-400 text-sm" role="alert">
                      {forgotError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-brass-500 text-bottle-900 font-medium py-2.5 rounded-lg text-sm hover:bg-brass-600 transition-colors"
                  >
                    Reset Password
                  </button>

                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="w-full border border-forest-700 text-ivory-100/70 py-2.5 rounded-lg text-sm hover:bg-bottle-950 transition-colors"
                  >
                    Cancel
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
