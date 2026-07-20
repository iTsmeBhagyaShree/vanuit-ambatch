import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import VanuitLogo from '../assets/VanuitLogo';
import loginBg from '../assets/outdoor_living_login.png';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const DEMO_USERS = {
    'admin@vanuitambacht.nl': { password: 'admin123', role: 'admin', name: 'Admin User' },
    'partner@vanuitambacht.nl': { password: 'partner123', role: 'partner', name: 'Sven Hoek' },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const user = DEMO_USERS[email];
    if (user && user.password === password) {
      login(user.role, user.name);
    } else {
      setError('Invalid credentials. Use demo credentials below.');
    }
  };

  return (
    <div className="min-h-screen flex bg-light">
      {/* Left – Brand Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-end">
        {/* Full background image */}
        <img
          src={loginBg}
          alt="Vanuit Ambacht Outdoor Kitchen"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent"></div>

        {/* Brand content at bottom */}
        <div className="relative z-10 p-12 text-white">
          {/* VA Logo mark */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 border-2 border-white/60 rounded-lg flex items-center justify-center">
              <VanuitLogo size={28} className="text-white" />
            </div>
            <div>
              <p className="font-body font-light tracking-[0.2em] text-white/80 text-sm uppercase">Vanuit</p>
              <p className="font-heading font-bold tracking-[0.15em] text-white text-lg uppercase">Ambacht</p>
            </div>
          </div>

          <blockquote className="text-2xl font-heading font-light text-white/90 leading-relaxed mb-4">
            "Crafting premium outdoor<br />living experiences."
          </blockquote>
          <p className="text-white/50 text-sm font-body font-light">
            Buitenkeukens op maat · Hiko-ombouw op maat
          </p>

          {/* Stats row */}
          <div className="mt-8 flex gap-8 pt-6 border-t border-white/20">
            {[
              { val: '500+', label: 'Projecten' },
              { val: '50+', label: 'Partners' },
              { val: '12+', label: 'Jaar ervaring' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-heading font-bold text-white">{s.val}</p>
                <p className="text-xs text-white/50 mt-0.5 font-body">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right – Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-light">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <VanuitLogo size={22} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-body font-light tracking-widest text-dark/50 uppercase">Vanuit</p>
              <p className="font-heading font-bold text-primary tracking-widest text-lg uppercase">Ambacht</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-heading font-bold text-primary">Welkom terug</h2>
            <p className="text-dark/50 font-body text-sm mt-2">Log in om verder te gaan met uw account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium font-body text-dark/70 mb-1.5">E-mailadres</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="u@vanuitambacht.nl"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium font-body text-dark/70 mb-1.5">Wachtwoord</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-cream py-3 rounded-xl font-body font-medium hover:bg-primary/90 transition-all shadow-card tracking-wide"
            >
              Inloggen
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-cream rounded-xl border border-cream-dark/60">
            <p className="text-[11px] font-semibold text-dark/50 uppercase tracking-widest mb-3 font-body">Demo toegang</p>
            <div className="space-y-2">
              {[
                { email: 'admin@vanuitambacht.nl', pass: 'admin123', name: 'Admin User', role: 'Admin', color: 'text-primary bg-primary/10' },
                { email: 'partner@vanuitambacht.nl', pass: 'partner123', name: 'Sven Hoek', role: 'Partner', color: 'text-accent bg-accent/10' },
              ].map((u, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setEmail(u.email); setPassword(u.pass); }}
                  className="flex justify-between items-center w-full p-3 bg-light rounded-lg border border-cream-dark/50 hover:border-primary/30 hover:bg-cream transition-all text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-dark font-body">{u.name}</p>
                    <p className="text-xs text-dark/40 font-body">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium font-body ${u.color}`}>{u.role}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-dark/30 text-center mt-2 font-body">Klik om automatisch in te vullen</p>
          </div>
        </div>
      </div>
    </div>
  );
}
