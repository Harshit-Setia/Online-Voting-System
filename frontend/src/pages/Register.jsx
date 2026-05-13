import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setSuccess("Account created successfully! Please check your email to verify your account.");
      setFormData({ name: '', email: '', password: '' });
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
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500 opacity-[0.05] blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold font-['Geist'] text-white tracking-tight">Create Account</h1>
          <p className="text-slate-400 mt-2 text-sm">Join the secure VOTEGUARD network.</p>
        </div>

        <div className="p-8 rounded-2xl bg-[#0F172A]/70 border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {error && <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          {success && <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">{success}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-500" />
                </div>                <input 
                  type="text" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-slate-600"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-500" />
                </div>                <input 
                  type="email" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-slate-600"
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
                  className="w-full pl-10 pr-4 py-3 bg-[#020617]/50 border border-white/5 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-slate-600"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || success}
              className="group flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] mt-6"
            >
              {loading ? 'Creating Account...' : 'Register Securely'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
