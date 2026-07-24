import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (username: string) => void;
  isDarkMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDarkMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (username === 'malya' && password === 'serverqa123') {
        onLogin(username);
        navigate('/');
        return;
      }

      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (response.ok) {
        onLogin(username);
        navigate('/');
      } else {
        setError('Invalid username or password (try: malya / serverqa123)');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen px-4 py-10 transition-colors duration-500 ${isDarkMode ? 'bg-[#1f0f14]' : 'bg-[#fffdfa]'}`}>
        <div className={`mx-auto flex min-h-[80vh] max-w-6xl flex-col overflow-hidden rounded-[36px] lg:flex-row ${isDarkMode ? 'border border-[#35131f] bg-[#1b0e12] text-white shadow-sm' : 'border border-[#f2e8e8] bg-white shadow-sm'}`}>
          {isDarkMode && (
            <div className={`flex flex-1 flex-col justify-center bg-gradient-to-br p-8 md:p-12 ${isDarkMode ? 'from-[#261018] to-[#1f0f14] text-white' : 'from-[#fff6f6] to-white text-[#111111]'}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.35em] ${isDarkMode ? 'text-pink-200' : 'text-[#e53935]'}`}>Malstro</p>
              <h1 className={`mt-4 text-4xl font-semibold tracking-tight md:text-5xl ${isDarkMode ? 'text-white' : ''}`} data-test="login-title">Welcome back to your next favorite find.</h1>
              <p className={`mt-4 max-w-md text-lg ${isDarkMode ? 'text-slate-300' : 'text-[#334155]'}`}>Sign in to discover curated essentials and enjoy a faster checkout experience.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className={`rounded-full px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 text-slate-200' : 'bg-[#fef2f2] text-[#b45309]'}`}>Fast delivery</span>
                <span className={`rounded-full px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 text-slate-200' : 'bg-[#fef2f2] text-[#b45309]'}`}>Secure checkout</span>
                <span className={`rounded-full px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 text-slate-200' : 'bg-[#fef2f2] text-[#b45309]'}`}>Premium picks</span>
              </div>
            </div>
          )}

        <div className={`flex flex-1 flex-col justify-center p-8 md:p-12 ${isDarkMode ? 'bg-transparent text-white' : ''}`}>
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 flex items-center justify-center">
              <img src="/malstro-logo.svg" alt="Malstro logo" className="h-16 w-16" />
            </div>
            <h2 className={`text-center text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>Sign in</h2>
            <p className={`mt-2 text-center text-sm ${isDarkMode ? 'text-slate-300' : 'text-[#6b7280]'}`}>Use your Malstro account to continue.</p>

            {error && (
              <div className="mt-6 rounded-[20px] border border-[#f1c1c1] bg-[#fff5f5] px-4 py-3 text-sm text-[#c62828]" data-test="login-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>Username</label>
                <input
                  type="text"
                  required
                  className={`${isDarkMode ? 'w-full rounded-[18px] border border-[#35131f] bg-[#2f1922] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#e53935]' : 'w-full rounded-[18px] border border-[#f2e8e8] bg-[#fcf8f8] px-4 py-3 text-sm outline-none focus:border-[#e53935]'} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#e53935]`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  data-test="username-input"
                  placeholder="malya"
                />
              </div>
              <div>
                <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`${isDarkMode ? 'w-full rounded-[18px] border border-[#35131f] bg-[#2f1922] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#e53935]' : 'w-full rounded-[18px] border border-[#f2e8e8] bg-[#fcf8f8] px-4 py-3 text-sm outline-none focus:border-[#e53935]'} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#e53935]`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-test="password-input"
                    placeholder="serverqa123"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <span className="material-icons text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#e53935] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c62828] disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e53935]"
                data-test="login-submit"
              >
                {loading ? 'Signing in...' : 'Continue'}
              </button>
            </form>

            <div className={`${isDarkMode ? 'mt-6 rounded-[24px] border border-[#35131f] bg-[#231018] p-4 text-sm' : 'mt-6 rounded-[24px] border border-[#f2e8e8] bg-[#fcf8f8] p-4 text-sm text-[#6b7280]'}`}>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>Demo access</p>
              <div className="mt-2 flex items-center justify-between">
                <span className={`${isDarkMode ? 'text-slate-300' : ''}`}>Username: malya</span>
                <span className={`${isDarkMode ? 'text-slate-300' : ''}`}>Password: serverqa123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
