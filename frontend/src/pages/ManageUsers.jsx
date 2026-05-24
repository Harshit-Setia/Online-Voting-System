import React, {
  useState,
  useEffect,
  useCallback
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Users,
  PlusCircle,
  Trash2,
  ArrowLeft,
  Loader2,
  Shield,
  User,
  Crown,
  ShieldCheck,
  Mail,
  UserPlus
} from 'lucide-react';

import { API_URL } from '../config';

const ManageUsers = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState('');

  const [currentUser, setCurrentUser] =
    useState(null);

  /* FORM */
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] =
    useState('');

  const [role, setRole] =
    useState('voter');

  const fetchUsers = useCallback(async () => {

    try {

      const token =
        localStorage.getItem('token');

      const res = await fetch(
        `${API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (res.ok) {

        setUsers(data);

      } else {

        setError(
          data.message ||
          'Failed to fetch users'
        );
      }

    } catch {

      setError(
        'Failed to fetch users.'
      );

    } finally {

      setLoading(false);
    }
  }, []);

  useEffect(() => {

    const storedUser =
      localStorage.getItem('user');

    if (storedUser) {

      setCurrentUser(
        JSON.parse(storedUser)
      );
    }

    fetchUsers();

  }, [fetchUsers]);

  const handleAddUser = async (e) => {

    e.preventDefault();

    setError('');

    setActionLoading(true);

    try {

      const token =
        localStorage.getItem('token');

      const res = await fetch(
        `${API_URL}/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          'Failed to add user'
        );
      }

      setName('');

      setEmail('');

      setPassword('');

      setRole('voter');

      await fetchUsers();

    } catch (err) {

      setError(err.message);

    } finally {

      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (
    userId
  ) => {

    if (
      !window.confirm(
        'Delete this user?'
      )
    ) {
      return;
    }

    setActionLoading(true);

    try {

      const token =
        localStorage.getItem('token');

      const res = await fetch(
        `${API_URL}/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          'Failed to delete user'
        );
      }

      await fetchUsers();

    } catch (err) {

      setError(err.message);

    } finally {

      setActionLoading(false);
    }
  };

  const votersCount =
    users.filter(
      (u) => u.role === 'voter'
    ).length;

  const adminsCount =
    users.filter(
      (u) => u.role === 'admin'
    ).length;

  const superadminsCount =
    users.filter(
      (u) => u.role === 'superadmin'
    ).length;

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
              User Administration System
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">

            Manage Platform

            <br />

            <span className="text-zinc-500">
              Users
            </span>
          </h1>

          <p className="text-zinc-500 text-lg mt-6 max-w-2xl leading-relaxed">
            Control access, manage voter
            accounts and securely administer
            VotePulse users.
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-zinc-500 text-sm">
                  Total Voters
                </p>

                <h2 className="text-5xl font-bold mt-3">

                  {votersCount}
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">

                <User
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
                  Administrators
                </p>

                <h2 className="text-5xl font-bold mt-3">

                  {adminsCount}
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">

                <Shield
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
                  Super Admin
                </p>

                <h2 className="text-5xl font-bold mt-3">

                  {superadminsCount}
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">

                <Crown
                  size={30}
                  className="text-amber-400"
                />
              </div>
            </div>
          </div>
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

                <UserPlus
                  size={22}
                  className="text-white"
                />

                <h2 className="text-2xl font-semibold">
                  Add User
                </h2>
              </div>

              <form
                onSubmit={handleAddUser}
                className="space-y-5"
              >

                {/* NAME */}
                <div>

                  <label className="text-xs uppercase tracking-wider text-zinc-500">

                    Full Name
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

                {/* EMAIL */}
                <div>

                  <label className="text-xs uppercase tracking-wider text-zinc-500">

                    Email Address
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="john@example.com"
                    className="mt-3 w-full h-14 rounded-2xl bg-[#111111] border border-white/10 px-5 text-white placeholder:text-zinc-600 outline-none focus:border-white transition-all"
                  />
                </div>

                {/* PASSWORD */}
                <div>

                  <label className="text-xs uppercase tracking-wider text-zinc-500">

                    Password
                  </label>

                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="••••••••"
                    className="mt-3 w-full h-14 rounded-2xl bg-[#111111] border border-white/10 px-5 text-white placeholder:text-zinc-600 outline-none focus:border-white transition-all"
                  />
                </div>

                {/* ROLE */}
                <div>

                  <label className="text-xs uppercase tracking-wider text-zinc-500">

                    Role
                  </label>

                  <select
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value)
                    }
                    className="mt-3 w-full h-14 rounded-2xl bg-[#111111] border border-white/10 px-5 text-white outline-none focus:border-white transition-all"
                  >

                    <option value="voter">
                      Voter
                    </option>

                    {currentUser?.role ===
                      'superadmin' && (
                      <>
                        <option value="admin">
                          Admin
                        </option>

                        <option value="superadmin">
                          Super Admin
                        </option>
                      </>
                    )}
                  </select>
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
                      Create Account

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

          {/* USERS */}
          <div className="lg:col-span-2">

            <div className="flex items-center justify-between mb-8">

              <div className="flex items-center gap-3">

                <Users
                  size={24}
                  className="text-white"
                />

                <h2 className="text-3xl font-semibold">
                  User Database
                </h2>
              </div>

              <div className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-sm text-zinc-400">

                Total Users:
                {' '}
                {users.length}
              </div>
            </div>

            {loading ? (

              <div className="flex justify-center py-20">

                <Loader2
                  size={32}
                  className="animate-spin"
                />
              </div>

            ) : users.length === 0 ? (

              <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-16 text-center">

                <Users
                  size={60}
                  className="mx-auto text-zinc-700 mb-6"
                />

                <h3 className="text-2xl font-semibold mb-3">
                  No Users Found
                </h3>

                <p className="text-zinc-500">
                  Start by creating your first
                  platform user.
                </p>
              </div>

            ) : (

              <div className="grid md:grid-cols-2 gap-6">

                {users.map((u) => (

                  <div
                    key={u.id}
                    className="group relative rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 hover:bg-white/[0.06] transition-all duration-300"
                  >

                    {/* DELETE */}
                    {(currentUser?.role ===
                      'superadmin' ||
                      (currentUser?.role ===
                        'admin' &&
                        u.role ===
                          'voter')) && (

                      <button
                        onClick={() =>
                          handleDeleteUser(
                            u.id
                          )
                        }
                        disabled={
                          actionLoading ||
                          u.id ===
                            currentUser?.id
                        }
                        className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 transition-all disabled:opacity-40"
                      >

                        <Trash2
                          size={18}
                          className="text-white"
                        />
                      </button>
                    )}

                    {/* PROFILE */}
                    <div className="flex items-start gap-4 mb-6">

                      <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-white/10 flex items-center justify-center">

                        <User
                          size={28}
                          className="text-zinc-500"
                        />
                      </div>

                      <div>

                        <h3 className="text-2xl font-bold">

                          {u.name}
                        </h3>

                        <div className="flex items-center gap-2 mt-2 text-zinc-500 text-sm">

                          <Mail size={14} />

                          {u.email}
                        </div>
                      </div>
                    </div>

                    {/* ROLE */}
                    <div className="flex items-center gap-3 flex-wrap mb-6">

                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${
                          u.role === 'superadmin'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : u.role ===
                              'admin'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}
                      >

                        {u.role ===
                          'superadmin' ? (
                          <Crown size={14} />
                        ) : u.role ===
                          'admin' ? (
                          <Shield size={14} />
                        ) : (
                          <User size={14} />
                        )}

                        {u.role === 'superadmin' ? 'super admin' : u.role}
                      </span>

                      {u.isVerified ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm">

                          <ShieldCheck
                            size={14}
                          />

                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 text-sm">

                          Pending
                        </span>
                      )}
                    </div>

                    {/* FOOTER */}
                    <div className="pt-5 border-t border-white/10 flex items-center justify-between">

                      <span className="text-zinc-500 text-sm">
                        User ID:
                        {' '}
                        {u.id}
                      </span>

                      <span className="text-white text-sm">
                        Active User
                      </span>
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

export default ManageUsers;