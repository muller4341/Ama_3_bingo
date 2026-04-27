import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Spinner } from 'flowbite-react';
import { FaUser, FaPhone, FaLock, FaSignInAlt, FaMoneyBillWave, FaTrophy, FaGift } from 'react-icons/fa';
import { GiPerspectiveDiceSixFacesRandom, GiPartyPopper } from 'react-icons/gi';

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

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
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phoneNumber: '',
    password: '',
    location: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^(07|09)\d{8}$/;
    return regex.test(phoneNumber.trim());
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (!formData.firstname || !formData.lastname || !formData.phoneNumber || !formData.password) {
      setErrorMessage('All fields are required. Please fill them out');
      return;
    }
    
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setErrorMessage('Phone number must start with 09 or 07 and be followed by 8 digits');
      return;
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      if (res.ok) {
        setShowApprovalModal(true);
        setTimeout(() => {
          setShowApprovalModal(false);
          navigate('/signin');
        }, 3000);
      }
    } catch (error) {
      setErrorMessage(error.message);    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(254,243,199,0.92)_30%,_rgba(251,191,36,0.2)_58%,_rgba(120,53,15,0.92)_100%)]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex items-center justify-center px-4 py-10 md:px-6 lg:px-10 order-2 lg:order-1">
          <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/50 bg-white/88 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-fuchsia-500 via-amber-400 to-emerald-500" />
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-fuchsia-600 via-rose-500 to-amber-400 shadow-lg">
                <span className="text-2xl font-black tracking-[0.2em] text-white">EB</span>
              </div>
              <h2 className="text-3xl font-black text-green-950">Create Account</h2>
              <p className="mt-2 text-slate-600">Join Ethio-bingo and start playing</p>
            </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-green-800" />
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 border border-fuchsia-200 rounded-xl focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all duration-200 bg-white/80"
                  id="firstname"
                  type="text"
                  placeholder="First Name"
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-green-800" />
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 border border-fuchsia-200 rounded-xl focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all duration-200 bg-white/80"
                  id="lastname"
                  type="text"
                  placeholder="Last Name"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-green-800" />
              </div>
              <input
                className="w-full pl-10 pr-4 py-3 border border-fuchsia-200 rounded-xl focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all duration-200 bg-white/80"
                id="phoneNumber"
                type="tel"
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-green-800" />
              </div>
              <input
                className="w-full pl-10 pr-4 py-3 border border-fuchsia-200 rounded-xl focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all duration-200 bg-white/80"
                id="location"
                type="text"
                placeholder="Location"
                onChange={handleChange}
              />
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
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-fuchsia-800 hover:text-fuchsia-900 font-semibold inline-flex items-center space-x-1">
                <span>Sign in</span>
                <FaSignInAlt className="text-sm" />
              </Link>
            </p>
          </form>
          </div>
        </div>

        <div className="relative order-1 hidden flex-col justify-center px-6 py-12 text-slate-900 md:px-12 lg:order-2 lg:flex lg:px-16">
          <div className="absolute right-10 top-10 h-24 w-24 rounded-full bg-amber-300/40 blur-3xl" />
          <div className="absolute bottom-16 left-16 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative z-10 max-w-2xl lg:ml-auto">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-lg backdrop-blur">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 via-rose-500 to-amber-400 text-sm font-black text-white shadow-md">EB</span>
              <span className="text-sm font-semibold tracking-[0.24em] text-green-950 uppercase">Ethio-bingo</span>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border border-white/70 bg-white/70 p-4 shadow-xl backdrop-blur transition-all duration-500 ${
                    currentSlide === index ? 'scale-[1.03] ring-2 ring-fuchsia-300/60' : 'opacity-75'
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
              <span className="rounded-full bg-white/75 px-4 py-2 shadow-md">Quick signup</span>
              <span className="rounded-full bg-white/75 px-4 py-2 shadow-md">Admin approval flow</span>
              <span className="rounded-full bg-white/75 px-4 py-2 shadow-md">Mobile-friendly design</span>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold text-green-700 mb-4">You registered successfully!</h2>
            <p className="text-lg text-gray-700 mb-6 text-center">Wait until approved by the admin.<br/>You can now sign in after approval.</p>
            <button
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              onClick={() => { setShowApprovalModal(false); navigate('/signin'); }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
