import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (username: string) => void;
  isDarkMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDarkMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call to FakeStoreAPI login
    try {
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
        setError('Invalid username or password (try: mor_2314 / 83r5^_ )');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 overflow-hidden relative ${isDarkMode ? 'bg-gray-950 bg-dark-pattern' : 'bg-gray-50 bg-light-pattern'}`}>
      {/* Decorative blobs */}
      <div className={`absolute top-0 -left-20 w-96 h-96 rounded-full blur-3xl animate-float ${isDarkMode ? 'bg-cyan-500/10' : 'bg-blue-500/10'}`}></div>
      <div className={`absolute bottom-0 -right-20 w-96 h-96 rounded-full blur-3xl animate-float ${isDarkMode ? 'bg-blue-500/10' : 'bg-purple-500/10'}`} style={{ animationDelay: '1.5s' }}></div>

      <div className={`max-w-md w-full glass p-12 rounded-[3rem] shadow-2xl transform hover:scale-[1.01] transition-all relative z-10 border-0 ${isDarkMode ? 'bg-black/40' : 'bg-white/60'}`} data-test="login-container">
        <div className="flex justify-center mb-10">
          <div className={`p-5 rounded-[2rem] shadow-2xl animate-float ${isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
            <span className="material-icons text-4xl">shopping_bag</span>
          </div>
        </div>
        <h1 className={`text-4xl font-black text-center mb-3 tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`} data-test="login-title">WELCOME BACK</h1>
        <p className={`text-center mb-10 font-bold uppercase tracking-widest text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Access the Elite Collection</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest animate-shake" data-test="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Identificator</label>
            <input
              type="text"
              required
              className={`mt-1 block w-full px-6 py-4 border-0 rounded-2xl transition-all outline-none font-bold shadow-inner ${isDarkMode ? 'bg-gray-900 text-white focus:ring-cyan-500' : 'bg-white text-gray-900 focus:ring-blue-500'}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-test="username-input"
              placeholder="mor_2314"
            />
          </div>
          <div>
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Security Key</label>
            <input
              type="password"
              required
              className={`mt-1 block w-full px-6 py-4 border-0 rounded-2xl transition-all outline-none font-bold shadow-inner ${isDarkMode ? 'bg-gray-900 text-white focus:ring-cyan-500' : 'bg-white text-gray-900 focus:ring-blue-500'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-test="password-input"
              placeholder="83r5^_"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-5 px-4 border border-transparent rounded-[2rem] shadow-2xl text-xs font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 disabled:bg-gray-400 transition-all ${isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}
            data-test="login-submit"
          >
            {loading ? 'Verifying Session...' : 'Initialize Access'}
          </button>
        </form>
        
        <div className={`mt-12 p-6 rounded-3xl border ${isDarkMode ? 'bg-cyan-500/5 border-cyan-500/10' : 'bg-blue-500/5 border-blue-500/10'}`}>
          <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-3 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>Testing Protocols</p>
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-gray-400">User: <span className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'}>mor_2314</span></span>
            <span className="text-gray-400">Pass: <span className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'}>83r5^_</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
