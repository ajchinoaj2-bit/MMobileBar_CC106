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
    <div className="min-h-screen bg-[#0d1f14] flex items-center justify-center gap-16 px-6">
      <div className="flex flex-col items-center text-center">
        <img src={logo} alt="M Mobile Bar" className="w-40 h-40" />
        <h1 className="text-green-400 text-2xl font-bold mt-4">M MOBILE BAR</h1>
        <p className="text-gray-400 text-sm">Event Bar & Beverage Services</p>
      </div>

      <div className="bg-[#12261a] rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-white text-xl font-semibold">Welcome Back</h2>
        <p className="text-gray-400 text-sm mb-4">Sign in to continue to your account</p>

        <div className="flex bg-[#0d1f14] border border-gray-600 rounded-lg p-1 mb-5">
          <button
            type="button"
            onClick={() => { setRole('owner'); setError(''); }}
            className={`flex-1 py-1.5 text-sm rounded ${
              role === 'owner' ? 'bg-green-600 text-white' : 'text-gray-400'
            }`}
          >
            Owner
          </button>
          <button
            type="button"
            onClick={() => { setRole('client'); setError(''); }}
            className={`flex-1 py-1.5 text-sm rounded ${
              role === 'client' ? 'bg-green-600 text-white' : 'text-gray-400'
            }`}
          >
            Client
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-3 py-2 rounded bg-[#0d1f14] border border-gray-600 text-white text-sm outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 rounded bg-[#0d1f14] border border-gray-600 text-white text-sm outline-none focus:border-green-500"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex justify-between items-center text-xs text-gray-400">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-green-400 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button type="submit" className="w-full">
            LOG IN AS {role === 'owner' ? 'OWNER' : 'CLIENT'}
          </Button>

          {role === 'client' && (
            <p className="text-center text-xs text-gray-400">
              Don't have an account? <Link to="/client/signup" className="text-red-400 hover:underline">Sign up</Link>
            </p>
          )}
        </form>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow p-6 text-center w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Password Reset Unavailable</h2>
            <p className="text-sm text-gray-500 mb-5">
              Password reset isn't available yet. Please contact the M Mobile Bar team directly for help accessing your account.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full bg-green-700 text-white py-2.5 rounded text-sm hover:bg-green-800"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}