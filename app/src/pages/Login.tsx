import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
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
      if ((username === 'malyasqa' || username === 'harfymalya@gmail.com') && password === 'serverqa123') {
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
    <div className={`min-h-screen px-4 py-10 transition-colors duration-500 bg-white`}>
        <div className={`mx-auto flex min-h-[80vh] max-w-lg flex-col border border-black bg-white shadow-none`}>
        <div className="flex flex-1 flex-col justify-center p-8 md:p-12 text-black">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-center text-3xl font-black uppercase tracking-widest text-black">Sign in</h2>
            <p className="mt-2 text-center text-xs uppercase tracking-wider text-zinc-500">Access your beauty account</p>

            {error && (
              <div className="mt-6 border border-red-600 bg-red-50 px-4 py-3 text-sm text-red-600 font-bold" data-test="login-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-widest">Username or Email</label>
                <input
                  type="text"
                  required
                  className={`w-full border-b border-black py-3 text-sm outline-none bg-transparent border-black`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  data-test="username-input"
                  placeholder="malyasqa or harfymalya@gmail.com"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-widest">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`w-full border-b border-black py-3 text-sm outline-none bg-transparent border-black text-black placeholder:text-zinc-400`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-test="password-input"
                    placeholder="serverqa123"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black"
                  >
                    <span className="material-icons text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F0F2F5] dark:bg-zinc-800 rounded-full px-4 py-4 text-sm font-bold text-black dark:text-white transition hover:opacity-90 disabled:opacity-70"
                data-test="login-submit"
              >
                {loading ? 'Verifying...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4">
              <Link to="/signup" className="block w-full bg-black dark:bg-white dark:text-black rounded-full px-4 py-4 text-sm font-bold text-white text-center transition hover:opacity-90">
                New to Malstro? Create Account
              </Link>
            </div>

            <div className="mt-12 border border-dashed border-zinc-300 p-6 text-xs text-zinc-500">
              <p className="font-black uppercase tracking-widest text-black dark:text-white mb-2">Demo access</p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span>User/Email: malyasqa / harfymalya@gmail.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pass: serverqa123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
