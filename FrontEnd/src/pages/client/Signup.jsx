import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/shared/Button';
import logo from '../../assets/images/Mlogo.png';

export default function ClientSignup() {
  const [form, setForm] = useState({
    fullname: '', username: '', email: '', password: '', confirmPassword: '',
  });
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (!agree) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    /*To do real registration*/
    navigate('/client/login');
  };

  return (
    <div className="min-h-screen bg-[#0d1f14] flex items-center justify-center gap-16 px-6">
      <div className="flex flex-col items-center text-center">
        <img src={logo} alt="M Mobile Bar" className="w-40 h-40" />
        <h1 className="text-green-400 text-2xl font-bold mt-4">M MOBILE BAR</h1>
        <p className="text-gray-400 text-sm">Event Bar & Beverage Services</p>
      </div>

      <div className="bg-[#12261a] rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-white text-xl font-semibold">Sign Up</h2>
        <p className="text-gray-400 text-sm mb-4">Create your account to continue</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-300 text-xs block mb-1">Fullname</label>
              <input
                type="text"
                value={form.fullname}
                onChange={handleChange('fullname')}
                placeholder="Enter your fullname"
                className="w-full px-3 py-2 rounded bg-[#0d1f14] border border-gray-600 text-white text-sm outline-none focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="text-gray-300 text-xs block mb-1">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={handleChange('username')}
                placeholder="Enter your username"
                className="w-full px-3 py-2 rounded bg-[#0d1f14] border border-gray-600 text-white text-sm outline-none focus:border-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-xs block mb-1">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded bg-[#0d1f14] border border-gray-600 text-white text-sm outline-none focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="text-gray-300 text-xs block mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              placeholder="Enter your password"
              className="w-full px-3 py-2 rounded bg-[#0d1f14] border border-gray-600 text-white text-sm outline-none focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="text-gray-300 text-xs block mb-1">Confirm Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="Confirm your password"
              className="w-full px-3 py-2 rounded bg-[#0d1f14] border border-gray-600 text-white text-sm outline-none focus:border-green-500"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-400">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            I agree to the <a href="#" className="text-red-400">Terms of Service</a> and <a href="#" className="text-red-400">Privacy Policy</a>
          </label>

          <Button type="submit" className="w-full">Sign Up</Button>

          <p className="text-center text-xs text-gray-400">
            Already have an account? <Link to="/client/login" className="text-red-400 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}