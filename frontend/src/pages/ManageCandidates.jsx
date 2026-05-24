import React, {
  useState,
  useEffect,
  useCallback
} from 'react';

import {
  useParams,
  useNavigate
} from 'react-router-dom';

import {
  Users,
  PlusCircle,
  Trash2,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  User,
  ShieldCheck,
  Crown
} from 'lucide-react';

import { API_URL } from '../config';
import { updateCandidateStatus } from '../services/candidateService';

const ManageCandidates = () => {

  const { electionId } = useParams();
  // If no electionId is provided, we will let the admin choose one
  const navigate = useNavigate();
  if (!electionId) {
    // Show a dropdown of elections to select
    const [electionsList, setElectionsList] = useState([]);
    const [loadingElections, setLoadingElections] = useState(true);
    const [errorElections, setErrorElections] = useState('');

    useEffect(() => {
      const fetchElections = async () => {
        try {
          const res = await fetch(`${API_URL}/elections`);
          const data = await res.json();
          if (res.ok) setElectionsList(data);
          else setErrorElections(data.message || 'Failed to load elections');
        } catch (e) {
          setErrorElections('Network error');
        } finally {
          setLoadingElections(false);
        }
      };
      fetchElections();
    }, []);

    if (loadingElections) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-zinc-400">Loading elections…</p>
        </div>
      );
    }
    if (errorElections) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-400">{errorElections}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0B0B] text-white">
        <h2 className="text-2xl mb-4">Select Election to Manage Candidates</h2>
        <select
          className="p-2 rounded bg-white/[0.03] border border-white/10 text-black"
          onChange={(e) => {
            const id = e.target.value;
            if (id) navigate(`/admin/manage-candidates/${id}`);
          }}
        >
          <option value="">-- Choose Election --</option>
          {electionsList.map((e) => (
            <option key={e.id} value={e.id}>{e.title} ({e.status})</option>
          ))}
        </select>
      </div>
    );
  }

 

  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState('');

  const [name, setName] = useState('');

  const [party, setParty] = useState('');

  const [photo, setPhoto] = useState(null);

  const [preview, setPreview] = useState(null);

  const fetchCandidates = useCallback(async () => {

    try {

      const res = await fetch(
        `${API_URL}/candidates/${electionId}`
      );

      const data = await res.json();

      if (res.ok) {

        setCandidates(data);

      } else {

        setError(
          data.message ||
          'Failed to fetch candidates'
        );
      }

    } catch {

      setError(
        'An error occurred while fetching candidates.'
      );

    } finally {

      setLoading(false);
    }
  }, [electionId]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleAddCandidate = async (e) => {

    e.preventDefault();

    setError('');

    setActionLoading(true);

    const formData = new FormData();

    formData.append('name', name);

    formData.append('party', party);

    formData.append('election_id', electionId);

    if (photo) {
      formData.append('photo', photo);
    }

    try {

      const token =
        localStorage.getItem('token');

      const res = await fetch(
        `${API_URL}/candidates`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          'Failed to add candidate'
        );
      }

      setName('');

      setParty('');

      setPhoto(null);

      setPreview(null);

      document.getElementById(
        'photo-upload'
      ).value = '';

      await fetchCandidates();

    } catch (err) {

      setError(err.message);

    } finally {

      setActionLoading(false);
    }
  };

  const handleDeleteCandidate = async (
    candidateId
  ) => {

    if (
      !window.confirm(
        'Delete this candidate?'
      )
    ) {
      return;
    }

    setActionLoading(true);

    try {

      const token =
        localStorage.getItem('token');

      const res = await fetch(
        `${API_URL}/candidates/${candidateId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          'Failed to delete candidate'
        );
      }

      await fetchCandidates();

    } catch (err) {

      setError(err.message);

    } finally {

      setActionLoading(false);
    }
  };

  const handleToggleActive = async (candidateId, currentStatus) => {
    setActionLoading(true);
    try {
      await updateCandidateStatus(candidateId, !currentStatus);
      await fetchCandidates();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };


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
              Candidate Management System
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">

            Manage Election

            <br />

            <span className="text-zinc-500">
              Candidates
            </span>
          </h1>

          <p className="text-zinc-500 text-lg mt-6 max-w-2xl leading-relaxed">
            Add, organize and manage election
            participants securely within the
            VotePulse platform.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">

            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* FORM */}
          <div>

            <div className="sticky top-6 rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-7">

              <div className="flex items-center gap-3 mb-8">

                <PlusCircle
                  size={22}
                  className="text-white"
                />

                <h2 className="text-2xl font-semibold">
                  Add Candidate
                </h2>
              </div>

              <form
                onSubmit={handleAddCandidate}
                className="space-y-6"
              >

                {/* IMAGE */}
                <div className="flex flex-col items-center">

                  <div className="w-28 h-28 rounded-full overflow-hidden border border-white/10 bg-[#111111] flex items-center justify-center mb-4">

                    {preview ? (
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User
                        size={40}
                        className="text-zinc-600"
                      />
                    )}
                  </div>

                  <label className="cursor-pointer text-sm text-zinc-400 hover:text-white transition-all">

                    Upload Photo

                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {

                        const file =
                          e.target.files[0];

                        if (file) {

                          setPhoto(file);

                          setPreview(
                            URL.createObjectURL(file)
                          );
                        }
                      }}
                    />
                  </label>
                </div>

                {/* NAME */}
                <div>

                  <label className="text-xs uppercase tracking-wider text-zinc-500">

                    Candidate Name
                  </label>

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="John Doe"
                    className="mt-3 w-full h-14 rounded-2xl bg-[#111111] border border-white/10 px-5 text-white placeholder:text-zinc-600 outline-none focus:border-white transition-all"
                  />
                </div>

                {/* PARTY */}
                <div>

                  <label className="text-xs uppercase tracking-wider text-zinc-500">

                    Party / Affiliation
                  </label>

                  <input
                    type="text"
                    required
                    value={party}
                    onChange={(e) =>
                      setParty(e.target.value)
                    }
                    placeholder="Independent"
                    className="mt-3 w-full h-14 rounded-2xl bg-[#111111] border border-white/10 px-5 text-white placeholder:text-zinc-600 outline-none focus:border-white transition-all"
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="group w-full h-14 rounded-2xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >

                  {actionLoading ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <>
                      Add Candidate

                      <PlusCircle
                        size={18}
                        className="group-hover:rotate-90 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* CANDIDATES */}
          <div className="lg:col-span-2">

            <div className="flex items-center justify-between mb-8">

              <div className="flex items-center gap-3">

                <Users
                  size={24}
                  className="text-white"
                />

                <h2 className="text-3xl font-semibold">
                  Existing Candidates
                </h2>
              </div>

              <div className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-sm text-zinc-400">

                Total:
                {' '}
                {candidates.length}
              </div>
            </div>

            {loading ? (

              <div className="flex justify-center py-20">

                <Loader2
                  size={32}
                  className="animate-spin"
                />
              </div>

            ) : candidates.length === 0 ? (

              <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-16 text-center">

                <Users
                  size={60}
                  className="mx-auto text-zinc-700 mb-6"
                />

                <h3 className="text-2xl font-semibold mb-3">
                  No Candidates Yet
                </h3>

                <p className="text-zinc-500">
                  Start by adding your first
                  election candidate.
                </p>
              </div>

            ) : (

              <div className="grid md:grid-cols-2 gap-6">

                {candidates.map((candidate) => (

                  <div
                    key={candidate.id}
                    className="group relative rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl overflow-hidden hover:bg-white/[0.06] transition-all duration-300"
                  >

                    {/* IMAGE */}
                    <div className="relative h-60 overflow-hidden">

                      {candidate.photo_url ? (

                        <img
                          src={candidate.photo_url}
                          alt={candidate.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                      ) : (

                        <div className="w-full h-full bg-[#111111] flex items-center justify-center">

                          <User
                            size={70}
                            className="text-zinc-700"
                          />
                        </div>
                      )}

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          handleDeleteCandidate(
                            candidate.id
                          )
                        }
                        disabled={actionLoading}
                        className="absolute top-4 right-4 w-11 h-11 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                      >

                        <Trash2
                          size={18}
                          className="text-white"
                        />
                      </button>
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">

                      <div className="flex items-center justify-between gap-3 mb-4">

                        <h3 className="text-2xl font-bold leading-tight">

                          {candidate.name}
                        </h3>

                        <ShieldCheck
                          size={22}
                          className="text-emerald-400"
                        />
                      </div>

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-sm text-zinc-300 mb-6">

                        <Crown size={14} />

                        {candidate.party}
                      </div>

                      <div className="pt-5 border-t border-white/10 flex items-center justify-between">

                        <span className="text-zinc-500 text-sm">
                          Candidate ID:
                          {' '}
                          {candidate.id}
                        </span>

                        <button
                          onClick={() => handleToggleActive(candidate.id, candidate.is_active)}
                          disabled={actionLoading}
                          className="text-sm font-medium text-emerald-400 border border-emerald-400 rounded px-2 py-1 hover:bg-emerald-400/10"
                        >
                          {candidate.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCandidates;