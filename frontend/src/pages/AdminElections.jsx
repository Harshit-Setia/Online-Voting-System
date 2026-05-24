// src/pages/AdminElections.jsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Edit, Trash2, Users, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { API_URL } from '../config';
import { toast } from 'react-hot-toast';

const AdminElections = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchElections = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/elections`);
      const data = await res.json();
      if (res.ok) setElections(data);
      else setError(data.message || 'Failed to load elections');
    } catch (e) {
      setError('Network error while loading elections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this election?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/elections/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      toast.success('Election deleted');
      fetchElections();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleSelectVoters = (election) => {
    // Placeholder UI – actual voter‑selection endpoint can be added later
    toast(`Select voters for "${election.title}" (feature coming soon)`);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white relative overflow-hidden">
      {/* GRID background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:70px_70px]" />

      {/* Ambient blur */}
      <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-white opacity-[0.03] blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-8"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Crown size={28} className="text-emerald-400" /> Manage Elections
        </h1>

        {loading && <p className="text-zinc-400">Loading elections…</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="space-y-8">
          {/* Upcoming elections */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="text-emerald-400" size={20} /> Upcoming
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {elections.filter(e => e.status === 'upcoming').map(election => (
                <div key={election.id} className="p-6 bg-white/[0.03] border border-white/10 rounded-xl backdrop-blur-sm hover:scale-[1.02] transition-all">
                  <h3 className="text-lg font-medium mb-2">{election.title}</h3>
                  <p className="text-sm text-zinc-400 mb-3">Starts: {formatDate(election.start_at)}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/admin/elections/${election.id}/add-candidate`)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 rounded hover:bg-emerald-600/30 transition"
                    >
                      <Users size={14} /> Add Candidate
                    </button>
                    <button
                      onClick={() => handleSelectVoters(election)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600/20 text-indigo-400 rounded hover:bg-indigo-600/30 transition"
                    >
                      <Users size={14} /> Select Voters
                    </button>
                    <button
                      onClick={() => navigate(`/admin/manage-candidates/${election.id}`)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-zinc-600/20 text-zinc-400 rounded hover:bg-zinc-600/30 transition"
                    >
                      <Edit size={14} /> Manage Candidates
                    </button>
                    <button
                      onClick={() => handleDelete(election.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ended elections */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <XCircle className="text-red-400" size={20} /> Ended
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {elections.filter(e => e.status === 'ended').map(election => (
                <div key={election.id} className="p-6 bg-white/[0.03] border border-white/10 rounded-xl backdrop-blur-sm hover:scale-[1.02] transition-all">
                  <h3 className="text-lg font-medium mb-2">{election.title}</h3>
                  <p className="text-sm text-zinc-400 mb-3">Ended: {formatDate(election.end_at)}</p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleSelectVoters(election)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600/20 text-indigo-400 rounded hover:bg-indigo-600/30 transition"
                    >
                      <Users size={14} /> Select Voters
                    </button>
                    <button
                      onClick={() => navigate(`/admin/manage-candidates/${election.id}`)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-zinc-600/20 text-zinc-400 rounded hover:bg-zinc-600/30 transition"
                    >
                      <Edit size={14} /> Manage Candidates
                    </button>
                    <button
                      onClick={() => navigate(`/results/${election.id}`)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-amber-600/20 text-amber-400 rounded hover:bg-amber-600/30 transition"
                    >
                      <Trophy size={14} /> View Results
                    </button>
                    <button
                      onClick={() => handleDelete(election.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminElections;
