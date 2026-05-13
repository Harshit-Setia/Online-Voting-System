import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import AddElection from './pages/AddElection';
import ManageCandidates from './pages/ManageCandidates';
import CastVote from './pages/CastVote';
import ManageUsers from './pages/ManageUsers';
import { Button } from '@headlessui/react';

const LandingPage = () => {
  const videoRef = useRef(null);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setNavVisible(true), 280);
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
        if (!video) return;
        // step backwards ~25fps
        video.currentTime = Math.max(0, video.currentTime - 0.04);
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
      if (!reversing && video.currentTime >= video.duration - 0.05) {
        video.pause();
        startReverse();
      }
    };

    video.play().catch(() => {});
    video.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      if (reverseInterval) clearInterval(reverseInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] font-sans selection:bg-[#3B82F6] selection:text-white relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        // poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
        >
          <source
            // src="https://assets.mixkit.co/videos/preview/mixkit-abstract-digital-connection-9124-large.mp4" 
            src="./public/vote.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]"></div>
      </div>

      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3B82F6] opacity-[0.05] blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      {/* Navbar */}
      <nav
        className={
          `fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b transition-all duration-700 ease-out backdrop-blur-sm ` +
          (navVisible
            ? 'bg-[#0F172A]/50 border-white/10 shadow-md translate-y-0 opacity-100'
            : 'bg-transparent border-transparent -translate-y-2 opacity-0')
        }
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              ONLINE VOTING SYSTEM
            </span>
          </div>


          <div className="flex items-center gap-4">
            <Button
              as={Link}
              to="/login"
              className="text-sm font-medium hover:text-white text-slate-300 transition-colors cursor-pointer"
            >
              Login
            </Button>
            <Button
              as={Link}
              to="/register"
              className="text-sm font-medium bg-[#3B82F6] hover:bg-[#0EA5E9] text-white px-5 py-2 rounded-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] cursor-pointer"
            >
              Register
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-sm text-slate-300">Live Institutional Voting Network</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
            Secure Democracy <br className="hidden md:block" /> in Your Hands.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Experience the next generation of institutional voting. Encrypted, transparent, and accessible from anywhere. Every vote is cryptographically secured.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              as={Link}
              to="/register"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto bg-[#3B82F6] hover:bg-[#0EA5E9] text-white px-8 py-4 rounded-xl font-medium transition-all duration-500 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_50px_rgba(34,211,238,0.6)] hover:scale-[1.02] cursor-pointer"
            >
              Get Started Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              as={Link}
              to="/login"
              className="flex items-center justify-center w-full sm:w-auto bg-[#0F172A]/70 hover:bg-[#0F172A] border border-white/10 hover:border-[#22D3EE]/50 backdrop-blur-xl text-white px-8 py-4 rounded-xl font-medium transition-all duration-500 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-[1.02] cursor-pointer"
            >
              Admin Portal
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/add-election" element={<AddElection />} />
        <Route path="/admin/manage-candidates/:electionId" element={<ManageCandidates />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/vote/:electionId" element={<CastVote />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
