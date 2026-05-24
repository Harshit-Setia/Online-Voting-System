import React, {
  useEffect,
  useState
} from 'react';
import { getResults, getWinner } from '../services/resultService';

import {
  useNavigate,
  useParams
} from 'react-router-dom';

import {
  Trophy,
  Users,
  Vote,
  ArrowLeft,
  Crown,
  ShieldCheck,
  Loader2
} from 'lucide-react';

import { API_URL } from '../config';

const Results = () => {

  const navigate = useNavigate();

  const { electionId } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [results, setResults] =
    useState([]);

  const [winner, setWinner] =
    useState(null);

  const [totalVotes, setTotalVotes] =
    useState(0);

  const [error, setError] =
    useState('');

  useEffect(() => {

    const fetchResults = async () => {

      try {

        const token =
          localStorage.getItem('token');

        const [resultsRes, winnerRes] =
          await Promise.all([

            fetch(
              `${API_URL}/results/${electionId}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            ),

            fetch(
              `${API_URL}/results/${electionId}/winner`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            )
          ]);

        const resultsData =
          await resultsRes.json();

        const winnerData =
          await winnerRes.json();

        if (!resultsRes.ok) {
          throw new Error(
            resultsData.message ||
              'Failed to fetch results'
          );
        }

        if (!winnerRes.ok) {
          throw new Error(
            winnerData.message ||
              'Failed to fetch winner'
          );
        }

        // TOTAL VOTES
        const total = resultsData.reduce((sum, item) => sum + Number(item.votes), 0);
        // Transform results to include candidate details and vote percentages
        const transformed = resultsData.map(item => ({
          id: item.candidate_id,
          name: item.Candidate?.name || '',
          party: item.Candidate?.party || '',
          photo: item.Candidate?.photo_url || '',
          votes: Number(item.votes),
          percentage: total ? ((Number(item.votes) / total) * 100).toFixed(1) : 0
        }));
        setResults(transformed);
        setWinner(winnerData);
        setTotalVotes(total);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchResults();
    const interval = setInterval(fetchResults, 30000);
    return () => clearInterval(interval);
  }, [electionId]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white relative overflow-hidden">

      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      {/* AMBIENT */}
      <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-white opacity-[0.03] blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* BACK */}
        <button
          onClick={() =>
            navigate('/dashboard')
          }
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-10"
        >

          <ArrowLeft size={18} />

          Back to Dashboard
        </button>

        {/* HERO */}
        <div className="mb-12">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-6">

            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>

            <span className="text-sm text-zinc-300">
              Live Election Analytics
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">

            Election

            <br />

            <span className="text-zinc-500">
              Results
            </span>
          </h1>

          <p className="text-zinc-500 text-lg mt-6 max-w-2xl leading-relaxed">
            Real-time election statistics,
            participation metrics and secure
            voting insights powered by
            VoteGuard.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">

            {error}
          </div>
        )}

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-zinc-500 text-sm">
                  Total Votes
                </p>

                <h2 className="text-5xl font-bold mt-3">

                  {totalVotes}
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">

                <Vote
                  size={30}
                  className="text-blue-400"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-zinc-500 text-sm">
                  Candidates
                </p>

                <h2 className="text-5xl font-bold mt-3">

                  {results.length}
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">

                <Users
                  size={30}
                  className="text-emerald-400"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-zinc-500 text-sm">
                  Winning Votes
                </p>

                <h2 className="text-5xl font-bold mt-3">

                  {winner?.votes || 0}
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">

                <Trophy
                  size={30}
                  className="text-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (

          <div className="flex justify-center py-24">

            <Loader2
              size={40}
              className="animate-spin"
            />
          </div>

        ) : (

          <>
            {/* WINNER */}
            {winner && (
              <div className="relative overflow-hidden rounded-[40px] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-white/[0.03] backdrop-blur-2xl p-10 mb-12">

                <div className="absolute inset-0 bg-amber-400 opacity-[0.03] blur-3xl"></div>

                <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">

                  {/* LEFT */}
                  <div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/10 mb-6">

                      <Crown
                        size={16}
                        className="text-amber-400"
                      />

                      <span className="text-sm text-amber-300">
                        Election Winner
                      </span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold leading-tight">

                      {winner.name}
                    </h2>

                    <p className="text-zinc-400 text-xl mt-4">

                      {winner.party}
                    </p>

                    <div className="flex items-center gap-6 mt-10 flex-wrap">

                      <div>

                        <p className="text-zinc-500 text-sm">
                          Votes
                        </p>

                        <h3 className="text-4xl font-bold mt-2">

                          {winner.votes}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex justify-center">

                    <div className="relative">

                      <div className="absolute inset-0 bg-amber-400 opacity-20 blur-3xl rounded-full"></div>

                      <img
                        src={winner.photo}
                        alt={winner.name}
                        className="relative w-72 h-72 object-cover rounded-full border-4 border-amber-400/20 shadow-2xl"
                      />

                      <div className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center shadow-2xl">

                        <Crown
                          size={28}
                          className="text-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RESULTS */}
            <div>

              <div className="flex items-center gap-3 mb-8">

                <ShieldCheck
                  size={24}
                  className="text-white"
                />

                <h2 className="text-3xl font-semibold">
                  Detailed Results
                </h2>
              </div>

              <div className="space-y-6">

                {results.map(
                  (candidate, index) => (

                    <div
                      key={candidate.id}
                      className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6"
                    >

                      <div className="flex flex-col md:flex-row md:items-center gap-6">

                        {/* PROFILE */}
                        <div className="flex items-center gap-5 min-w-[300px]">

                          <div className="relative">

                            <img
                              src={
                                candidate.photo
                              }
                              alt={
                                candidate.name
                              }
                              className="w-20 h-20 rounded-2xl object-cover border border-white/10"
                            />

                            {index === 0 && (
                              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">

                                <Crown
                                  size={16}
                                  className="text-black"
                                />
                              </div>
                            )}
                          </div>

                          <div>

                            <h3 className="text-2xl font-bold">

                              {
                                candidate.name
                              }
                            </h3>

                            <p className="text-zinc-500 mt-1">

                              {
                                candidate.party
                              }
                            </p>
                          </div>
                        </div>

                        {/* BAR */}
                        <div className="flex-1">

                          <div className="flex items-center justify-between mb-3">

                            <span className="text-zinc-400 text-sm">

                              Vote Share
                            </span>

                            <span className="text-white font-semibold">

                              {
                                candidate.percentage
                              }
                              %
                            </span>
                          </div>

                          <div className="w-full h-4 rounded-full bg-[#111111] overflow-hidden">

                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${
                                index === 0
                                  ? 'bg-amber-400'
                                  : index ===
                                    1
                                  ? 'bg-blue-400'
                                  : 'bg-emerald-400'
                              }`}
                              style={{
                                width: `${candidate.percentage}%`
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* VOTES */}
                        <div className="min-w-[120px] text-right">

                          <p className="text-zinc-500 text-sm">
                            Total Votes
                          </p>

                          <h3 className="text-3xl font-bold mt-2">

                            {
                              candidate.votes
                            }
                          </h3>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Results;