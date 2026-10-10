import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '../../components/shared/Button';
import logo from '../../assets/images/Mlogo.png';
import { signup, validateSignup } from '../../utils/auth';

export default function ClientSignup() {
  const [form, setForm] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateSignup(form);

    if (!agree) {
      validationErrors.agree =
        'You must agree to the Terms of Service and Privacy Policy.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    signup(form);
    navigate('/');
  };

  const labelClass =
    'text-ivory-100/60 text-[11px] uppercase tracking-wider block mb-1.5';

  const inputClass =
    'w-full px-3 py-2 rounded bg-bottle-950 border border-forest-700 text-ivory-50 text-sm outline-none focus:border-brass-500 transition-colors';

  const eyeButtonClass =
    'absolute right-3 top-1/2 -translate-y-1/2 text-ivory-100 hover:text-brass-400 transition-colors';

  return (
    <div className="relative min-h-screen overflow-hidden bg-bottle-950 flex items-center justify-center gap-16 px-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(201,169,97,0.12), transparent 45%), radial-gradient(circle at 80% 70%, rgba(42,77,56,0.35), transparent 50%)',
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-bottle-950/40 to-bottle-950" />

      <div className="relative flex flex-col items-center text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-brass-500/20 blur-2xl scale-125" />
          <img src={logo} alt="M Mobile Bar" className="relative w-40 h-40" />
        </div>

        <h1 className="font-display text-brass-500 text-4xl font-semibold mt-5 tracking-wide">
          M Mobile Bar
        </h1>

        <div className="flex items-center gap-3 mt-3">
          <span className="h-px w-8 bg-brass-500/50" />
          <p className="text-ivory-100/50 text-xs uppercase tracking-[0.2em]">
            Event Bar &amp; Beverage Services
          </p>
          <span className="h-px w-8 bg-brass-500/50" />
        </div>
      </div>

      <div className="relative bg-bottle-900/90 backdrop-blur border border-brass-500/20 rounded-xl p-8 w-full max-w-sm shadow-[0_0_60px_-15px_rgba(201,169,97,0.25)]">
        <h2 className="font-display text-ivory-50 text-2xl font-semibold">
          Create Your Account
        </h2>

        <p className="text-ivory-100/60 text-sm mb-5">
          Sign up to start booking your event
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                value={form.fullname}
                onChange={handleChange('fullname')}
                placeholder="Juan Dela Cruz"
                className={inputClass}
              />
              {errors.fullname && (
                <p className="text-red-400 text-[10px] mt-1">
                  {errors.fullname}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Username</label>
              <input
                type="text"
                value={form.username}
                onChange={handleChange('username')}
                placeholder="juandelacruz"
                className={inputClass}
              />
              {errors.username && (
                <p className="text-red-400 text-[10px] mt-1">
                  {errors.username}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
              className={inputClass}
            />
            {errors.email && (
              <p className="text-red-400 text-[10px] mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Password</label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                placeholder="At least 8 characters, letters and numbers"
                className={`${inputClass} pr-10`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className={eyeButtonClass}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-400 text-[10px] mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Confirm Password</label>

            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="Re-enter your password"
                className={`${inputClass} pr-10`}
              />

              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className={eyeButtonClass}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-400 text-[10px] mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 text-xs text-ivory-100/60 pt-1">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            I agree to the <span className="text-brass-400">Terms of Service</span> and{' '}
            <span className="text-brass-400">Privacy Policy</span>
          </label>

          {errors.agree && (
            <p className="text-red-400 text-[10px]">{errors.agree}</p>
          )}

          <Button type="submit" className="w-full">
            Sign Up
          </Button>

          <p className="text-center text-xs text-ivory-100/60">
            Already have an account?{' '}
            <Link
              to="/"
              className="text-brass-400 hover:text-brass-300 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
