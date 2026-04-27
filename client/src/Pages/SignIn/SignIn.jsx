import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Spinner } from 'flowbite-react';
import { signInStart, signInSuccess, signInFail } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { FaPhone, FaLock, FaUserPlus, FaMoneyBillWave, FaTrophy, FaGift } from 'react-icons/fa';
import { GiPerspectiveDiceSixFacesRandom, GiPartyPopper } from 'react-icons/gi';

const SignIn = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ phoneNumber: '', password: '' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: <FaMoneyBillWave className="text-4xl text-yellow-400" />,
      title: "Win Real Prizes",
      description: "እውነተኛ ሽልማቶችን አሸንፉ!"
    },
    {
      icon: <GiPerspectiveDiceSixFacesRandom className="text-4xl text-green-600" />,
      title: "Random Draws",
      description: "ድንገተኛ ማሰባሰብ!"
    },
    {
      icon: <FaTrophy className="text-4xl text-amber-500" />,
      title: "Leaderboard",
      description: "የአሸናፊዎች ዝርዝር!"
    },
    {
      icon: <FaGift className="text-4xl text-pink-500" />,
      title: "Daily Bonuses",
      description: "ዕለታዊ ተጨማሪ እነሆች!"
    },
    {
      icon: <GiPartyPopper className="text-4xl text-fuchsia-500" />,
      title: "Fun & Social",
      description: "ደስታና ማህበራዊነት!"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phoneNumber || !formData.password) {
      setErrorMessage('Phone number and password are required.');
      return dispatch(signInFail('Phone number and password are required.'));
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success === false || !res.ok) {
        // Show specific message for not approved
        if (data.message === 'Your account is not approved yet. Please wait for admin approval.') {
          setErrorMessage(data.message);
        } else {
          setErrorMessage(data.message || 'Login failed.');
        }
        return dispatch(signInFail(data.message || 'Login failed.'));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setErrorMessage('An error occurred. Please try again.');
      dispatch(signInFail(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(255,243,205,0.9)_32%,_rgba(245,158,11,0.22)_62%,_rgba(120,53,15,0.92)_100%)]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative hidden flex-col justify-center px-6 py-12 text-slate-900 md:px-12 lg:flex lg:px-16">
          <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-amber-300/40 blur-3xl" />
          <div className="absolute bottom-16 right-16 h-40 w-40 rounded-full bg-fuchsia-500/25 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-lg backdrop-blur">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-700 via-emerald-500 to-amber-400 text-sm font-black text-white shadow-md">EB</span>
              <span className="text-sm font-semibold tracking-[0.24em] text-green-950 uppercase">Ethio-bingo</span>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border border-white/70 bg-white/70 p-4 shadow-xl backdrop-blur transition-all duration-500 ${
                    currentSlide === index ? 'scale-[1.03] ring-2 ring-amber-300/60' : 'opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-slate-900/5 p-3">{feature.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-green-950">{feature.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 text-sm font-semibold text-green-950">
              <span className="rounded-full bg-white/75 px-4 py-2 shadow-md">Fast access</span>
              <span className="rounded-full bg-white/75 px-4 py-2 shadow-md">Secure login</span>
              <span className="rounded-full bg-white/75 px-4 py-2 shadow-md">Live game updates</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 md:px-6 lg:px-10">
          <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/50 bg-white/88 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-500 via-amber-400 to-fuchsia-500" />
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-green-700 via-emerald-500 to-amber-400 shadow-lg">
                <span className="text-2xl font-black tracking-[0.2em] text-white">EB</span>
              </div>
              <h2 className="text-3xl font-black text-green-950">Sign In</h2>
              <p className="mt-2 text-slate-600">Access your Ethio-bingo account</p>
            </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-green-800" />
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 border border-fuchsia-200 rounded-xl focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all duration-200 bg-white/80"
                  id="phoneNumber"
                  type="text"
                  placeholder="Phone Number (07 or 09...)"
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-green-800" />
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 border border-fuchsia-200 rounded-xl focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all duration-200 bg-white/80"
                  id="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
                <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            <button
              className="w-full bg-gradient-to-r from-red-400 to-yellow-400 hover:from-green-400 hover:to-yellow-400 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Spinner className="animate-spin text-white fill-green-200" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-fuchsia-800 hover:text-fuchsia-900 font-semibold inline-flex items-center space-x-1 ">
                Sign up
                <FaUserPlus className="text-sm" />
              </Link>
            </p>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
