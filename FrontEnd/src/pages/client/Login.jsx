import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/shared/Button';
import logo from '../../assets/images/Mlogo.png';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // no real auth yet
    navigate('/client/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0d1f14] flex items-center justify-center gap-16 px-6">
      <div className="flex flex-col items-center text-center">
        <img src={logo} alt="M Mobile Bar" className="w-40 h-40" />
        <h1 className="text-green-400 text-2xl font-bold mt-4">M MOBILE BAR</h1>
        <p className="text-gray-400 text-sm">Event Bar & Beverage Services</p>
      </div>

      <div className="bg-[#12261a] rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-white text-xl font-semibold">Welcome to M Mobile Bar</h2>
        <p className="text-gray-400 text-sm mb-2">Book your event with us today</p>
        <hr className="border-gray-700 mb-4" />

        <h3 className="text-white text-sm font-semibold mb-1">Sign In</h3>
        <p className="text-gray-400 text-xs mb-4">Enter your account to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded bg-[#0d1f14] border border-gray-600 text-white text-sm outline-none focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 rounded bg-[#0d1f14] border border-gray-600 text-white text-sm outline-none focus:border-green-500"
              required
            />
          </div>

          <div className="flex justify-between items-center text-xs text-gray-400">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <a href="#" className="text-green-400 hover:underline">Forgot Password?</a>
          </div>

          <Button type="submit" className="w-full">Sign In</Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate('/client/signup')}
          >
            Create an Account
          </Button>
        </form>
      </div>
    </div>
  );
}