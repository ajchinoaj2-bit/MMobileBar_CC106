import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/shared/Button';
import logo from '../assets/images/Mlogo.png';
import { login } from '../utils/auth';

export default function Login() {
  const [role, setRole] = useState('owner'); // 'owner' | 'client'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password, role);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setError('');
    navigate(role === 'owner' ? '/owner/dashboard' : '/client/dashboard');
  };

  return (
    <div className="min-h-screen bg-bottle-950 flex items-center justify-center gap-16 px-6">
      <div className="flex flex-col items-center text-center">
        <img src={logo} alt="M Mobile Bar" className="w-40 h-40" />
        <h1 className="font-display text-brass-500 text-3xl font-semibold mt-4 tracking-wide">
          M Mobile Bar
        </h1>
        <p className="text-ivory-100/60 text-sm">Event Bar & Beverage Services</p>
      </div>

      <div className="bg-bottle-900 border border-forest-700/60 rounded-lg p-8 w-full max-w-sm shadow-xl">
        <h2 className="font-display text-ivory-50 text-xl font-semibold">Welcome Back</h2>
        <p className="text-ivory-100/60 text-sm mb-4">Sign in to continue to your account</p>

        <div className="flex bg-bottle-950 border border-forest-700 rounded-lg p-1 mb-5">
          <button
            type="button"
            onClick={() => { setRole('owner'); setError(''); }}
            className={`flex-1 py-1.5 text-sm rounded transition-colors ${
              role === 'owner' ? 'bg-brass-500 text-bottle-900 font-medium' : 'text-ivory-100/50'
            }`}
          >
            Owner
          </button>
          <button
            type="button"
            onClick={() => { setRole('client'); setError(''); }}
            className={`flex-1 py-1.5 text-sm rounded transition-colors ${
              role === 'client' ? 'bg-brass-500 text-bottle-900 font-medium' : 'text-ivory-100/50'
            }`}
          >
            Client
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-ivory-100/70 text-sm block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-3 py-2 rounded bg-bottle-950 border border-forest-700 text-ivory-50 text-sm outline-none focus:border-brass-500"
            />
          </div>

          <div>
            <label className="text-ivory-100/70 text-sm block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 rounded bg-bottle-950 border border-forest-700 text-ivory-50 text-sm outline-none focus:border-brass-500"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex justify-between items-center text-xs text-ivory-100/60">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
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
              <Link to="/client/signup" className="text-brass-400 hover:text-brass-300 hover:underline">
                Sign up
              </Link>
            </p>
          )}
        </form>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-ivory-50 rounded-lg shadow-xl p-6 text-center w-full max-w-sm">
            <h2 className="font-display text-lg font-semibold text-bottle-900 mb-2">
              Password Reset Unavailable
            </h2>
            <p className="text-sm text-charcoal-500 mb-5">
              Password reset isn't available yet. Please contact the M Mobile Bar team directly for help accessing your account.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full bg-brass-500 text-bottle-900 font-medium py-2.5 rounded text-sm hover:bg-brass-600 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}