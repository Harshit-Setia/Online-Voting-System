import React, {
  useEffect,
  useRef,
  useState,
  useContext
} from 'react';

import {
  ArrowRight,
  ShieldCheck,
  Vote,
  BarChart3
} from 'lucide-react';

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import AddElection from './pages/AddElection';
import ManageCandidates from './pages/ManageCandidates';
import CastVote from './pages/CastVote';
import ManageUsers from './pages/ManageUsers';
import Results from './pages/Results';
import AdminElections from './pages/AdminElections';

import { Button } from '@headlessui/react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'react-hot-toast';

const LandingPage = () => {

  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const videoRef = useRef(null);

  const [navVisible, setNavVisible] =
    useState(false);

  useEffect(() => {

    const t = setTimeout(
      () => setNavVisible(true),
      250
    );

    return () => clearTimeout(t);

  }, []);

  useEffect(() => {

    const video = videoRef.current;

    if (!video) return;

    let reverseInterval = null;

    let reversing = false;

    const startReverse = () => {

      reversing = true;

      reverseInterval = setInterval(() => {

        video.currentTime = Math.max(
          0,
          video.currentTime - 0.04
        );

        if (video.currentTime <= 0.05) {

          clearInterval(reverseInterval);

          reversing = false;

          video.currentTime = 0;

          video.play().catch(() => {});
        }

      }, 40);
    };

    const onTimeUpdate = () => {

      if (!video.duration) return;

      if (
        !reversing &&
        video.currentTime >=
          video.duration - 0.05
      ) {

        video.pause();

        startReverse();
      }
    };

    video.play().catch(() => {});

    video.addEventListener(
      'timeupdate',
      onTimeUpdate
    );

    return () => {

      video.removeEventListener(
        'timeupdate',
        onTimeUpdate
      );

      if (reverseInterval) {
        clearInterval(reverseInterval);
      }
    };

  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white overflow-hidden relative">

      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover opacity-[0.14]"
        >

          <source
            src="/vote.mp4"
            type="video/mp4"
          />

        </video>

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      {/* AMBIENT LIGHT */}
      <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-white opacity-[0.03] blur-[120px] rounded-full"></div>

      {/* NAVBAR */}
      <nav
        className={
          `fixed top-0 left-0 right-0 z-50 transition-all duration-700 ` +
          (navVisible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-4 opacity-0')
        }
      >

        <div className="max-w-7xl mx-auto px-6 pt-5">

          <div className="border border-white/10 bg-black/40 backdrop-blur-2xl rounded-2xl px-6 py-4 flex items-center justify-between">

            {/* LOGO */}
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center">

                <Vote
                  size={18}
                  className="text-black"
                />
              </div>

              <h1 className="text-xl font-semibold tracking-wide">
                VotePulse
              </h1>
            </div>

            {/* LINKS */}
            <div className="hidden md:flex items-center gap-10 text-sm text-zinc-400">

              <a
                href="#features"
                className="hover:text-white transition-colors"
              >
                Features
              </a>

              <a
                href="#security"
                className="hover:text-white transition-colors"
              >
                Security
              </a>

              <a
                href="#analytics"
                className="hover:text-white transition-colors"
              >
                Analytics
              </a>
              {/* ADMIN LINK */}
              <a
                href="/admin/manage-candidates"
                className="hover:text-white transition-colors"
              >
                Manage Candidates
              </a>
              <a
                href="/admin/elections"
                className="hover:text-white transition-colors ml-4"
              >
                Manage Elections
              </a>
              {/* END ADMIN LINK */}
            </div>

            {/* BUTTONS */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="hidden sm:inline text-sm text-zinc-400">
                    Hello, <strong className="text-white">{user?.name}</strong>
                  </span>
                  <Button
                    as={Link}
                    to="/dashboard"
                    className="text-sm font-medium bg-white text-black px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition-all cursor-pointer"
                  >
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    className="text-sm font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Login
                  </Button>

                  <Button
                    as={Link}
                    to="/register"
                    className="text-sm font-medium bg-white text-black px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition-all cursor-pointer"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-8">

              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>

              <span className="text-sm text-zinc-300 tracking-wide">
                Secure Digital Democracy
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.92] tracking-tight">

              Voting.

              <br />

              <span className="text-zinc-500">
                Reimagined.
              </span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl">
              A modern online voting platform built for secure,
              transparent, and seamless digital elections.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              {isAuthenticated ? (
                <Button
                  as={Link}
                  to="/dashboard"
                  className="group flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:bg-zinc-200 transition-all"
                >
                  Go to Dashboard
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/register"
                    className="group flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:bg-zinc-200 transition-all"
                  >

                    Get Started

                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Button>

                  <Button
                    as={Link}
                    to="/login"
                    className="border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white px-8 py-4 rounded-2xl font-medium transition-all"
                  >
                    Admin Portal
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="relative">

            <div className="relative p-8 rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl">

              <div className="flex items-center justify-between mb-8">

                <div>

                  <p className="text-zinc-500 text-sm">
                    Active Election
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    Student Council 2026
                  </h3>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center">

                  <Vote className="text-white" />
                </div>
              </div>

              <div>

                <div className="flex items-center justify-between text-sm text-zinc-400 mb-3">

                  <span>Voting Progress</span>

                  <span>72%</span>
                </div>

                <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">

                  <div className="h-full w-[72%] bg-white rounded-full"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mt-10">

                <div className="p-5 rounded-2xl border border-white/10 bg-black/30">

                  <p className="text-zinc-500 text-sm">
                    Total Voters
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    8,421
                  </h2>
                </div>

                <div className="p-5 rounded-2xl border border-white/10 bg-black/30">

                  <p className="text-zinc-500 text-sm">
                    Votes Casted
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    6,075
                  </h2>
                </div>
              </div>
            </div>

            {/* FLOATING CARD */}
            <div className="absolute -bottom-8 -left-8 hidden md:block">

              <div className="p-5 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-xl">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center border border-white/10">

                    <ShieldCheck className="text-white" />
                  </div>

                  <div>

                    <h4 className="font-semibold">
                      End-to-End Security
                    </h4>

                    <p className="text-sm text-zinc-500 mt-1">
                      Protected & encrypted voting
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {

  return (
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            {/* Protected routes */}
            <Route element={<PrivateRoute />}> 
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/add-election" element={<AddElection />} />
              <Route path="/admin/edit-election/:electionId" element={<AddElection />} />
              <Route path="/admin/elections" element={<AdminElections />} />
              <Route path="/admin/manage-candidates/:electionId?" element={<ManageCandidates />} />
              <Route path="/admin/manage-users" element={<ManageUsers />} />
              <Route path="/vote/:electionId" element={<CastVote />} />
              <Route path="/results/:electionId" element={<Results />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;