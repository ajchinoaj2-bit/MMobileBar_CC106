import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/shared/Button';
import logo from '../../assets/images/Mlogo.png';
import { signup, validateSignup } from '../../utils/auth';

export default function ClientSignup() {
  const [form, setForm] = useState({
    fullname: '', username: '', email: '', password: '', confirmPassword: '',
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateSignup(form);
    if (!agree) {
      validationErrors.agree = 'You must agree to the Terms of Service and Privacy Policy.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    signup(form);
    navigate('/');
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
        <h2 className="font-display text-ivory-50 text-xl font-semibold">Sign Up</h2>
        <p className="text-ivory-100/60 text-sm mb-4">Create your account to continue</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-ivory-100/70 text-xs block mb-1">Fullname</label>
              <input
                type="text"
                value={form.fullname}
                onChange={handleChange('fullname')}
                placeholder="Enter your fullname"
                className="w-full px-3 py-2 rounded bg-bottle-950 border border-forest-700 text-ivory-50 text-sm outline-none focus:border-brass-500"
              />
              {errors.fullname && <p className="text-red-400 text-[10px] mt-1">{errors.fullname}</p>}
            </div>
            <div>
              <label className="text-ivory-100/70 text-xs block mb-1">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={handleChange('username')}
                placeholder="Enter your username"
                className="w-full px-3 py-2 rounded bg-bottle-950 border border-forest-700 text-ivory-50 text-sm outline-none focus:border-brass-500"
              />
              {errors.username && <p className="text-red-400 text-[10px] mt-1">{errors.username}</p>}
            </div>
          </div>

          <div>
            <label className="text-ivory-100/70 text-xs block mb-1">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded bg-bottle-950 border border-forest-700 text-ivory-50 text-sm outline-none focus:border-brass-500"
            />
            {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-ivory-100/70 text-xs block mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              placeholder="At least 8 characters, letters and numbers"
              className="w-full px-3 py-2 rounded bg-bottle-950 border border-forest-700 text-ivory-50 text-sm outline-none focus:border-brass-500"
            />
            {errors.password && <p className="text-red-400 text-[10px] mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="text-ivory-100/70 text-xs block mb-1">Confirm Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="Confirm your password"
              className="w-full px-3 py-2 rounded bg-bottle-950 border border-forest-700 text-ivory-50 text-sm outline-none focus:border-brass-500"
            />
            {errors.confirmPassword && <p className="text-red-400 text-[10px] mt-1">{errors.confirmPassword}</p>}
          </div>

          <label className="flex items-center gap-2 text-xs text-ivory-100/60">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            I agree to the <span className="text-brass-400">Terms of Service</span> and{' '}
            <span className="text-brass-400">Privacy Policy</span>
          </label>
          {errors.agree && <p className="text-red-400 text-[10px]">{errors.agree}</p>}

          <Button type="submit" className="w-full">Sign Up</Button>

          <p className="text-center text-xs text-ivory-100/60">
            Already have an account?{' '}
            <Link to="/" className="text-brass-400 hover:text-brass-300 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}