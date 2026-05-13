import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard'); // placeholder for next page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-[#F8FAFC] relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/wall.jpeg')", filter: 'blur(6px) scale(1.03)', transformOrigin: 'center' }}
      ></div>
      <div className="absolute inset-0 bg-black/45 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3B82F6] opacity-[0.06] blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold font-['Geist'] text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 mt-2 text-sm">Secure access to the VOTEGUARD portal.</p>
        </div>

        <div className="p-8 rounded-2xl bg-[#0F172A]/70 border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {error && <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-500" />
                </div>                <input 
                  type="email" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all text-white placeholder-slate-600"
                  placeholder="admin@institution.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-500" />
                </div>                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all text-white placeholder-slate-600"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="group flex items-center justify-center gap-2 w-full bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] mt-6"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account? <Link to="/register" className="text-[#3B82F6] hover:text-blue-400 font-medium transition-colors">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
