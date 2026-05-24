import { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  CalendarClock,
  Clock,
  Loader2,
  LogOut,
  PlusCircle,
  Settings,
  Shield,
  ShieldCheck,
  Users,
  User,
  Vote,
  XCircle,
  Trophy
} from 'lucide-react';

import { API_URL } from '../config';

const statusBadge = (status) => {
  const map = {
    upcoming: {
      label: 'Upcoming',
      cls: 'bg-white/[0.03] text-zinc-400 border-white/10'
    },
    active: {
      label: 'Live',
      cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    ended: {
      label: 'Ended',
      cls: 'bg-red-500/10 text-red-400 border-red-500/20'
    }
  };

  const s = map[status] || map.upcoming;

  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${s.cls}`}
    >
      {s.label}
    </span>
  );
};

const Dashboard = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(null);

  const [elections, setElections] = useState([]);

  const [loadingElections, setLoadingElections] =
    useState(false);

  const [adminMessage, setAdminMessage] = useState(null);
  useEffect(() => {
    if (adminMessage) {
      const timer = setTimeout(() => setAdminMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [adminMessage]);

  const [editOpen, setEditOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) return;

      const data = await res.json();

      setProfile(data);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));

      setEditForm({
        email: data.email || '',
        password: ''
      });
    } catch (error) {
      console.error('Failed to refresh profile:', error); 
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fetchElections = useCallback(async () => {

    setLoadingElections(true);

    try {

      const res = await fetch(
        `${API_URL}/elections`
      );

      const data = await res.json();

      setElections(Array.isArray(data) ? data : []);

    } catch {

      setElections([]);

    } finally {

      setLoadingElections(false);
    }
  }, []);

  // Admin action handlers
  const handleStartElection = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/elections/start/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const error = await res.json();
        setAdminMessage(error.message || 'Failed to start election');
        return;
      }
      await fetchElections();
    } catch (e) {
      setAdminMessage('Server error');
    }
  };

  const handleEndElection = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/elections/end/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const error = await res.json();
        setAdminMessage(error.message || 'Failed to end election');
        return;
      }
      await fetchElections();
    } catch (e) {
      setAdminMessage('Server error');
    }
  };

  const handleDeleteElection = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this election?')) return;
    try {
      const res = await fetch(`${API_URL}/elections/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const error = await res.json();
        setAdminMessage(error.message || 'Failed to delete election');
        return;
      }
      await fetchElections();
    } catch (e) {
      setAdminMessage('Server error');
    }
  };

  const handleEditElection = (election) => {
    navigate(`/admin/edit-election/${election.id}`);
  };

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/me/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      setUser(data.user);
      setProfile(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setEditOpen(false);
    } catch (err) {
      // setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const isAdmin =
    user.role === 'admin' ||
    user.role === 'superadmin';

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white relative overflow-hidden">

      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      {/* AMBIENT */}
      <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-white opacity-[0.03] blur-[120px] rounded-full"></div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-2xl">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">

              <Vote
                size={22}
                className="text-black"
              />
            </div>

            <div>

              <h1 className="font-semibold text-lg">
                VotePulse
              </h1>

              <p className="text-zinc-500 text-sm">
                Secure Voting Platform
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <button
            onClick={handleLogout}
            className="h-12 px-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* HERO */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 md:p-10">

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">

            {/* LEFT */}
            <div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-6">

                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>

                <span className="text-sm text-zinc-300">
                  Secure Voting Network
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">

                Welcome back,

                <br />

                <span className="text-zinc-500">
                  {user.name}
                </span>
              </h1>

              <p className="text-zinc-500 text-lg mt-6 max-w-2xl leading-relaxed">
                Monitor elections, manage voting activity
                and securely control your digital
                voting platform.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <div className="p-5 rounded-3xl border border-white/10 bg-white/[0.03]">

                <h2 className="text-4xl font-bold">
                  {elections.length}
                </h2>

                <p className="text-zinc-500 mt-2 text-sm">
                  Total Elections
                </p>
              </div>

              <div className="p-5 rounded-3xl border border-white/10 bg-white/[0.03]">

                <h2 className="text-4xl font-bold">
                  {
                    elections.filter(
                      (e) => e.status === 'active'
                    ).length
                  }
                </h2>

                <p className="text-zinc-500 mt-2 text-sm">
                  Active Elections
                </p>
              </div>

              <div className="p-5 rounded-3xl border border-white/10 bg-white/[0.03]">

                <h2 className="text-4xl font-bold">
                  {
                    elections.reduce(
                      (acc, e) =>
                        acc + (e.votesCast || 0),
                      0
                    )
                  }
                </h2>

                <p className="text-zinc-500 mt-2 text-sm">
                  Votes Cast
                </p>
              </div>

              <div className="p-5 rounded-3xl border border-white/10 bg-white/[0.03]">

                <h2 className="text-4xl font-bold">
                  {(profile?.isVerified ??
                    user.isVerified)
                    ? 'Yes'
                    : 'No'}
                </h2>

                <p className="text-zinc-500 mt-2 text-sm">
                  Verified
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE + ADMIN */}
{adminMessage && (
  <div className="mt-4 p-2 bg-amber-500/10 border border-amber-500 text-amber-300 rounded">
    {adminMessage}
  </div>
)}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* PROFILE */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">

            <div className="flex items-center gap-3 mb-8">

              <Settings size={22} />

              <h2 className="text-2xl font-semibold">
                My Profile
              </h2>
            </div>

            {!editOpen ? (
              <div className="space-y-5">

                <div>

                  <p className="text-xs uppercase text-zinc-500">
                    Name
                  </p>

                  <h3 className="mt-2 text-lg font-medium">
                    {profile?.name || user.name}
                  </h3>
                </div>

                <div>

                  <p className="text-xs uppercase text-zinc-500">
                    Email
                  </p>

                  <h3 className="mt-2 text-lg font-medium">
                    {profile?.email || user.email}
                  </h3>
                </div>

                <div className="">
                  <p className="text-xs uppercase text-zinc-500">
                    Role
                  </p>

                  <h3 className="mt-2 text-lg font-medium capitalize">
                    {profile?.role || user.role}
                  </h3>
                </div>



                <button
                  onClick={() =>
                    setEditOpen(true)
                  }
                  className="w-full h-14 mt-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Email input */}
                <input
                  type="email"
                  placeholder="New Email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      email: e.target.value
                    })
                  }
                  className="w-full h-14 rounded-2xl bg-[#111111] border border-white/10 px-5 outline-none"
                />



                {/* BUTTONS */}
                <div className="flex gap-3">

                  <button onClick={handleSaveProfile} className="flex-1 h-14 rounded-2xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all">
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setEditOpen(false)
                    }}
                    className="flex-1 h-14 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* VOTER QUICK GUIDE - Fills the empty space when not admin */}
          {!isAdmin && (
            <div className="lg:col-span-2 rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 relative overflow-hidden flex flex-col justify-between">
              {/* Inner ambient glow */}
              <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-white opacity-[0.02] blur-[80px] rounded-full"></div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-emerald-400" size={24} />
                  <h2 className="text-2xl font-bold tracking-tight">Voter Security Hub</h2>
                </div>

                <p className="text-zinc-400 leading-relaxed mb-8 max-w-xl">
                  Your vote is secure, encrypted, and completely confidential. Follow these simple guidelines to safely cast your digital ballot in active elections.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                    <Vote className="text-purple-400" size={20} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">1. Find Elections</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Browse the "Live Elections" section below to see active, upcoming, or ended campaigns.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                    <Users className="text-blue-400" size={20} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">2. View Info</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Check election details, end dates, and list of candidates before casting your vote.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <ShieldCheck className="text-emerald-400" size={20} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">3. Vote Securely</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Submit your choice. Once validated, your vote is anonymized and locked into the ledger.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN TOOLS */}
          {isAdmin && (
            <div className="lg:col-span-2 rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">

              <div className="flex items-center gap-3 mb-8">

                <Shield
                  className="text-emerald-400"
                  size={22}
                />

                <h2 className="text-2xl font-semibold">
                  Election Management
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <button
                  onClick={() =>
                    navigate('/admin/add-election')
                  }
                  className="group p-8 rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all text-left"
                >

                  <PlusCircle
                    size={36}
                    className="mb-6 text-white group-hover:scale-110 transition-transform"
                  />

                  <h3 className="text-xl font-semibold">
                    Add Election
                  </h3>

                  <p className="text-zinc-500 mt-3 text-sm">
                    Create and launch new elections.
                  </p>
                </button>

                <button
                  onClick={() =>
                    navigate('/admin/manage-users')
                  }
                  className="group p-8 rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all text-left"
                >

                  <Users
                    size={36}
                    className="mb-6 text-white group-hover:scale-110 transition-transform"
                  />

                  <h3 className="text-xl font-semibold">
                    Manage Users
                  </h3>

                  <p className="text-zinc-500 mt-3 text-sm">
                    Control user access and permissions.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ELECTIONS */}
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">

          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-3">

              <CalendarClock size={24} />

              <h2 className="text-3xl font-semibold">
                Live Elections
              </h2>
            </div>

            <button
              onClick={fetchElections}
              className="h-12 px-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
            >
              Refresh
            </button>
          </div>

          {loadingElections ? (

            <div className="flex items-center justify-center py-20">

              <Loader2
                size={32}
                className="animate-spin"
              />
            </div>

          ) : elections.length === 0 ? (

            <div className="text-center py-20 text-zinc-500">

              No elections found.
            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {elections.map((election) => {

                const isActive =
                  election.status === 'active';

                return (
                  <div
                    key={election.id}
                    className={`relative p-7 rounded-[30px] border transition-all duration-300 ${
                      isActive
                        ? 'bg-white/[0.06] border-white/20 scale-[1.01]'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05]'
                    }`}
                  >

                    {/* LIVE DOT */}
                    {isActive && (
                      <span className="absolute top-5 right-5 flex h-3 w-3">

                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>

                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                      </span>
                    )}

                    <div className="mb-6">

                      {statusBadge(election.status)}
                    </div>

                    <h3 className="text-2xl font-bold leading-tight">

                      {election.title}
                    </h3>

                    {election.description && (
                      <p className="text-zinc-500 mt-4 leading-relaxed">
                        {election.description}
                      </p>
                    )}

                    <div className="mt-8 space-y-3 text-sm text-zinc-500">

                      <div className="flex items-center gap-2">

                        <Clock size={14} />

                        Starts:
                        {' '}
                        {new Date(
                          election.start_time
                        ).toLocaleDateString()}
                      </div>

                      <div className="flex items-center gap-2">

                        <XCircle size={14} />

                        Ends:
                        {' '}
                        {new Date(
                          election.end_time
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">

                      <span className="text-zinc-500 text-sm">
                        {
                          election.votesCast || 0
                        } votes
                      </span>

                      {isActive ? (

                        <button
                          onClick={() =>
                            navigate(
                              `/vote/${election.id}`
                            )
                          }
                          className="h-12 px-5 rounded-2xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all flex items-center justify-center gap-3"
                        >
                          Cast Vote
                        </button>

                      ) : election.status === 'ended' ? (

                        <button
                          onClick={() =>
                            navigate(
                              `/results/${election.id}`
                            )
                          }
                          className="h-12 px-5 rounded-2xl bg-amber-500/20 text-amber-400 font-semibold hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Trophy size={16} /> View Results
                        </button>

                      ) : (

                        <span className="text-sm text-zinc-600">
                          Not Started
                        </span>
                      )}
                    </div>

                    {/* Admin controls */}
                    {isAdmin && (
                      <div className="mt-5 pt-4 border-t border-white/5 flex gap-2 justify-end flex-wrap">
                        {election.status !== 'ended' && (
                          <>
                            <button
                              onClick={() => navigate(`/admin/manage-candidates/${election.id}`)}
                              className="px-4 py-2 rounded-2xl border text-sm font-medium transition-all text-[#DCCCEC] border-[#DCCCEC]/20 bg-[#DCCCEC]/5 hover:bg-[#DCCCEC]/10"
                            >
                              Candidates
                            </button>
                            <button
                              onClick={() => handleEditElection(election)}
                              className="px-4 py-2 rounded-2xl border text-sm font-medium transition-all text-[#BCD8EC] border-[#BCD8EC]/20 bg-[#BCD8EC]/5 hover:bg-[#BCD8EC]/10"
                            >
                              Edit
                            </button>
                            {election.status === 'upcoming' && (
                              <button
                                onClick={() => handleStartElection(election.id)}
                                className="px-4 py-2 rounded-2xl border text-sm font-medium transition-all text-[#D6E5BD] border-[#D6E5BD]/20 bg-[#D6E5BD]/5 hover:bg-[#D6E5BD]/10"
                              >
                                Start
                              </button>
                            )}
                            {election.status === 'active' && (
                              <button
                                onClick={() => handleEndElection(election.id)}
                                className="px-4 py-2 rounded-2xl border text-sm font-medium transition-all text-[#F9E1A8] border-[#F9E1A8]/20 bg-[#F9E1A8]/5 hover:bg-[#F9E1A8]/10"
                              >
                                End
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteElection(election.id)}
                          className="px-4 py-2 rounded-2xl border text-sm font-medium transition-all text-red-300 border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;