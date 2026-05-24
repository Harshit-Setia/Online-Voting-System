import React, { useState, useEffect, useCallback } from 'react';

import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Vote,
  Search,
  X
} from 'lucide-react';

import {
  useParams,
  useNavigate
} from 'react-router-dom';

import { API_URL } from '../config';

const CastVote = () => {
  const { electionId } = useParams();

  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [step, setStep] = useState(1);

  const [otp, setOtp] = useState('');

  const [actionLoading, setActionLoading] = useState(false);

  const [voteSuccess, setVoteSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getPartyStyles = (partyName = '') => {
    const p = partyName.toUpperCase();
    if (p.includes('BJP') || p.includes('NDA')) {
      return {
        badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        glow: 'bg-amber-500/5',
        theme: 'amber'
      };
    }
    if (p.includes('INC') || p.includes('CONG')) {
      return {
        badge: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
        glow: 'bg-sky-500/5',
        theme: 'sky'
      };
    }
    if (p.includes('AAP')) {
      return {
        badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        glow: 'bg-emerald-500/5',
        theme: 'emerald'
      };
    }
    return {
      badge: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
      glow: 'bg-violet-500/5',
      theme: 'violet'
    };
  };

  const fetchData = useCallback(async () => {
    try {
      const [elecRes, candRes] = await Promise.all([
        fetch(`${API_URL}/elections/${electionId}`),
        fetch(`${API_URL}/candidates/${electionId}`)
      ]);

      const elecData = await elecRes.json();

      const candData = await candRes.json();

      if (!elecRes.ok) {
        throw new Error(elecData.message || 'Failed to fetch election details');
      }

      if (!candRes.ok) {
        throw new Error(
          candData.message ||
          'Failed to fetch candidates'
        );
      }

      setElection(elecData);

      setCandidates(candData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [electionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRequestOTP = async () => {
    if (!selectedCandidate) return;

    setActionLoading(true);

    setError('');

    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (!user) {
        setError('Session expired. Please log in.');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      const res = await fetch(
        `${API_URL}/votes/request-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            election_id: parseInt(electionId)
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || 'Failed to request OTP'
        );
      }

      setStep(2);

    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCastVote = async (e) => {
    e.preventDefault();

    if (!selectedCandidate || !otp) return;

    setActionLoading(true);

    setError('');

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          candidate_id: parseInt(selectedCandidate.id),
          election_id: parseInt(electionId),
          otp
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || 'Failed to cast vote'
        );
      }

      setVoteSuccess(true);

      // After successful vote, navigate to results page for this election
      setTimeout(() => {
        navigate(`/results/${electionId}`);
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">

        <Loader2
          size={42}
          className="text-white animate-spin"
        />
      </div>
    );
  }

  /* SUCCESS */
  if (voteSuccess) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center px-6 relative overflow-hidden">

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

        {/* LIGHT */}
        <div className="absolute w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] rounded-full"></div>

        <div className="relative z-10 max-w-lg w-full p-10 rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl text-center">

          <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">

            <ShieldCheck
              size={46}
              className="text-emerald-400"
            />
          </div>

          <h1 className="text-5xl font-bold tracking-tight">
            Vote Secured
          </h1>

          <p className="text-zinc-400 mt-5 text-lg leading-relaxed">
            Your vote has been securely encrypted
            and successfully recorded.
          </p>

          <div className="flex items-center justify-center gap-3 mt-10 text-zinc-500">

            <Loader2
              size={18}
              className="animate-spin"
            />

            Redirecting to results...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white relative overflow-hidden px-6 py-10">

      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      {/* AMBIENT */}
      <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-white opacity-[0.03] blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-14">

          <div className="flex items-center gap-5">

            <button
              onClick={() => navigate('/dashboard')}
              className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center transition-all"
            >
              <ArrowLeft size={20} />
            </button>

            <div>

              <h1 className="text-5xl font-bold tracking-tight">
                Secure Voting Portal
              </h1>

              <p className="text-zinc-500 mt-3 text-lg">
                {election?.title}
              </p>
            </div>
          </div>

          {step === 1 && (
            <div className="px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-300 text-sm">
              Step 1 • Select Candidate
            </div>
          )}

          {step === 2 && (
            <div className="px-5 py-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm">
              Step 2 • Verify Identity
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            {/* SEARCH & FILTER BAR */}
            <div className="relative max-w-xl mx-auto mb-12">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-500">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search candidates by name or party..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-14 pr-12 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-5 flex items-center text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* FILTERED CANDIDATES */}
            {(() => {
              const filtered = candidates.filter((c) => {
                if (!c.is_active) return false;
                const query = searchQuery.toLowerCase();
                return (
                  c.name.toLowerCase().includes(query) ||
                  c.party.toLowerCase().includes(query)
                );
              });

              if (filtered.length === 0) {
                return (
                  <div className="text-center py-20 rounded-[32px] border border-white/5 bg-white/[0.01] backdrop-blur-md max-w-xl mx-auto">
                    <Vote size={48} className="mx-auto text-zinc-600 mb-6 animate-pulse" />
                    <h3 className="text-2xl font-bold text-white">No Candidates Found</h3>
                    <p className="text-zinc-500 mt-2">We couldn't find any candidate matching "{searchQuery}"</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-6 h-11 px-6 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-sm font-semibold border border-white/10 transition-colors text-white"
                    >
                      Clear Search
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filtered.map((candidate) => {
                    const isSelected = selectedCandidate?.id === candidate.id;
                    const style = getPartyStyles(candidate.party);

                    return (
                      <div
                        key={candidate.id}
                        onClick={() => setSelectedCandidate(candidate)}
                        className={`group relative p-8 rounded-[32px] border cursor-pointer transition-all duration-500 backdrop-blur-2xl overflow-hidden flex flex-col ${
                          isSelected
                            ? 'bg-white/[0.05] border-emerald-500/40 scale-[1.03] shadow-[0_0_50px_rgba(16,185,129,0.12)]'
                            : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:-translate-y-2 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
                        }`}
                      >
                        {/* GLOWING AMBIENT HALO */}
                        <div
                          className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${style.glow}`}
                        ></div>

                        {/* SELECTED DECORATOR */}
                        {isSelected && (
                          <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/20 animate-scale-in">
                            <CheckCircle2 size={18} className="text-black stroke-[3px]" />
                          </div>
                        )}

                        {/* AVATAR CONTAINER */}
                        <div className="relative mb-8 self-start">
                          <div
                            className={`absolute inset-0 rounded-3xl blur-[12px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${
                              isSelected ? 'opacity-30 bg-emerald-500' : 'bg-white'
                            }`}
                          ></div>
                          {candidate.photo_url ? (
                            <img
                              src={candidate.photo_url}
                              alt={candidate.name}
                              className={`w-28 h-28 rounded-3xl object-cover relative z-10 border transition-all duration-500 ${
                                isSelected ? 'border-emerald-400' : 'border-white/10 group-hover:border-white/20'
                              }`}
                            />
                          ) : (
                            <div
                              className={`w-28 h-28 rounded-3xl border flex items-center justify-center text-4xl font-extrabold relative z-10 transition-all duration-500 ${
                                isSelected
                                  ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400'
                                  : 'bg-white/[0.04] border-white/10 text-white group-hover:bg-white/[0.08]'
                              }`}
                            >
                              {candidate.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* INFO */}
                        <div className="flex-grow">
                          <span className={`inline-flex px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${style.badge}`}>
                            {candidate.party}
                          </span>
                          <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                            {candidate.name}
                          </h2>
                          <p className="text-zinc-500 mt-3 text-sm leading-relaxed">
                            {candidate.description || `Registered candidate representing the ${candidate.party} for this secure, democratic poll.`}
                          </p>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                          <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">
                            Verified Candidate
                          </span>
                          <Vote
                            size={18}
                            className={`transition-colors duration-300 ${
                              isSelected ? 'text-emerald-400' : 'text-zinc-600 group-hover:text-zinc-400'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* BUTTON */}
            <div className="flex justify-center mt-16">
              <button
                onClick={handleRequestOTP}
                disabled={!selectedCandidate || actionLoading}
                className={`group h-16 px-12 rounded-2xl font-bold text-lg transition-all duration-500 flex items-center gap-3 disabled:opacity-30 disabled:pointer-events-none hover:-translate-y-0.5 ${
                  selectedCandidate
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:brightness-110'
                    : 'bg-white/[0.04] text-zinc-500 border border-white/10'
                }`}
              >
                {actionLoading ? (
                  <Loader2 size={22} className="animate-spin text-black" />
                ) : (
                  <>
                    Confirm Selection
                    <ArrowLeft
                      size={18}
                      className="rotate-180 group-hover:translate-x-1 transition-transform stroke-[2.5px]"
                    />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* OTP STEP */
          <div className="max-w-xl mx-auto">

            <div className="p-10 rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl text-center">

              {/* ICON */}
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">

                <Phone
                  size={40}
                  className="text-emerald-400"
                />
              </div>

              {/* TEXT */}
              <h2 className="text-4xl font-bold">
                Verify Your Identity
              </h2>

              <p className="text-zinc-500 mt-5 leading-relaxed text-lg">
                A secure OTP has been sent to your
                registered email address.
              </p>

              {/* FORM */}
              <form
                onSubmit={handleCastVote}
                className="mt-10 space-y-8"
              >

                {/* OTP */}
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value.replace(/\D/g, '')
                    )
                  }
                  placeholder="000000"
                  className="w-full h-20 rounded-3xl bg-[#111111] border border-white/10 text-center text-4xl tracking-[0.4em] font-mono text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-400 transition-all"
                />

                {/* BUTTONS */}
                <div className="flex gap-4">

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp('');
                      setError('');
                    }}
                    className="flex-1 h-16 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={
                      otp.length !== 6 || actionLoading
                    }
                    className="flex-[2] h-16 rounded-2xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >

                    {actionLoading ? (
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                    ) : (
                      <>
                        Confirm Vote

                        <ShieldCheck size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CastVote;