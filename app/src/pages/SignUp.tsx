interface SignUpProps {
}

const SignUp: React.FC<SignUpProps> = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [emailEntered, setEmailEntered] = useState(false);
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [marketingEmail, setMarketingEmail] = useState(false);
  const [marketingSMS, setMarketingSMS] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.length > 3) {
      setEmailEntered(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 1500);
  };

  return (
    <div className={`min-h-screen px-4 py-10 transition-colors duration-500 bg-white`}>
        <div className={`mx-auto flex min-h-[80vh] max-w-lg flex-col border border-black bg-white shadow-none`}>
        <div className="flex flex-1 flex-col justify-center p-8 md:p-12 text-black">
          <div className="mx-auto w-full max-w-lg">
            {!emailEntered ? (
              <>
                <div className="mb-6">
                  <h2 className={`text-3xl font-black leading-tight uppercase tracking-widest text-black`}>Sign Up</h2>
                </div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-10">Enter your email address to start</p>
                
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label className={`block text-[10px] font-black uppercase tracking-widest text-zinc-600`}>Email Address*</label>
                    <input
                      type="email"
                      required
                      className={`w-full border-b py-3 text-sm outline-none bg-transparent border-black text-black placeholder:text-zinc-400`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="malyasqa@gmail.com"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-6 bg-[#F0F2F5] rounded-full px-4 py-4 text-sm font-bold text-black transition hover:opacity-90"
                  >
                    Continue
                  </button>
                </form>
                <div className="mt-4">
                  <Link to="/login" className="block w-full bg-black rounded-full px-4 py-4 text-sm font-bold text-white text-center transition hover:opacity-90">
                    Already have an account? Sign In
                  </Link>
                </div>

                <div className="mt-10 border border-dashed border-zinc-300 p-6 text-xs text-zinc-500">
                  <p className="font-black uppercase tracking-widest text-black mb-2">Demo Registration</p>
                  <p className="mb-2">On this page, please enter an email address only to start the simulation:</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black">Email: malyasqa@gmail.com</span>
                  </div>
                </div>
              </>
            ) : success ? (
                <div className="text-center py-10">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center bg-green-500 text-white rounded-full">
                        <span className="material-icons text-4xl">check</span>
                    </div>
                    <h2 className={`text-2xl font-black uppercase tracking-widest text-black`}>Account Created Successfully</h2>
                    <p className="mt-2 text-xs uppercase tracking-wider text-zinc-500">Redirecting to sign in page...</p>
                </div>
            ) : (
                <>
                <div className="mb-6">
                  <h2 className={`text-2xl font-black leading-tight max-w-[280px] text-black`}>Join our Beauty Pass Program</h2>
                </div>
                
                <p className={`text-sm mb-8 flex items-center gap-1 font-medium text-black`}>
                  Continuing as <span className="font-bold">{email}</span>
                  <span className="material-icons text-green-500 text-sm">check_circle</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <input
                        type="text"
                        required
                        className={`w-full border p-3 text-sm outline-none bg-transparent rounded-lg border-zinc-200 text-black placeholder:text-zinc-400`}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="malya"
                      />
                  </div>
                  <div className="space-y-1">
                      <input
                        type="text"
                        required
                        className={`w-full border p-3 text-sm outline-none bg-transparent rounded-lg border-zinc-200 text-black placeholder:text-zinc-400`}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="salsabila"
                      />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-1/4 relative">
                    <select className={`w-full border p-3 text-sm outline-none bg-transparent rounded-lg appearance-none border-zinc-200 text-black pr-8`}>
                      <option>+62</option>
                    </select>
                    <span className="material-icons absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">expand_more</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="tel"
                      className={`w-full border p-3 text-sm outline-none bg-transparent rounded-lg border-zinc-200 text-black placeholder:text-zinc-400`}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="876 3456 5767"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      className={`w-full border p-3 text-sm outline-none bg-transparent rounded-lg border-zinc-200 text-black placeholder:text-zinc-400`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="malyasqa"
                    />
                  </div>
                  <div className="space-y-1 relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className={`w-full border p-3 text-sm outline-none bg-transparent rounded-lg border-zinc-200 text-black placeholder:text-zinc-400`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="serverqa123"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      <span className="material-icons text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-6">
                  <h3 className={`text-sm font-bold mb-4 text-black`}>Terms & Conditions*</h3>
                  <div className="flex gap-3">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      className="mt-1 h-5 w-5 border-zinc-300 rounded"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      required
                    />
                    <label htmlFor="terms" className="text-[12px] leading-relaxed text-zinc-600">
                      I agree to the Malstro, and how my personal data may be collected, used, and processed by Malstro as set out in the Privacy Policy.
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className={`text-sm font-bold mb-4 text-black`}>Marketing Preference</h3>
                  <p className="text-[12px] text-zinc-600 mb-4 leading-relaxed">
                    I agree to Malstro and its service providers sending marketing and promotional messages to me regarding products, services, and/or events through:
                  </p>
                  <div className="flex gap-8">
                    <label className={`flex items-center gap-2 text-sm font-medium text-black`}>
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 border-zinc-300 rounded" 
                        checked={marketingEmail}
                        onChange={(e) => setMarketingEmail(e.target.checked)}
                      />
                      Email
                    </label>
                    <label className={`flex items-center gap-2 text-sm font-medium text-black`}>
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 border-zinc-300 rounded" 
                        checked={marketingSMS}
                        onChange={(e) => setMarketingSMS(e.target.checked)}
                      />
                      SMS
                    </label>
                  </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !agreedToTerms}
                    className="w-full mt-6 bg-black rounded-full px-4 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Create Account'}
                </button>
                </form>

                <div className="mt-10 pt-6 border-t border-zinc-100 text-[10px] text-zinc-400 space-y-4">
                  <div className="border border-dashed border-zinc-300 p-4 rounded-lg">
                    <p className="font-black uppercase tracking-widest text-black mb-2 text-[9px]">Account Simulation Data</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <p>Name: malya salsabila</p>
                      <p>Phone: +62 876 3456 5767</p>
                      <p>User: malyasqa</p>
                      <p>Pass: serverqa123</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p>Malstro is refers to PT Malstro Indonesia, and each related company.</p>
                  </div>
                </div>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
