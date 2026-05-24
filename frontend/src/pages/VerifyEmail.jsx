import React, {
  useEffect,
  useState
} from 'react';

import {
  useSearchParams,
  Link,
  useNavigate
} from 'react-router-dom';

import {
  CheckCircle,
  XCircle,
  Loader2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

import { API_URL } from '../config';

const VerifyEmail = () => {

  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get('token');

  const navigate = useNavigate();

  const [status, setStatus] =
    useState('loading');

  const [message, setMessage] =
    useState('');

  useEffect(() => {

    if (!token) {

      setStatus('error');

      setMessage(
        'Invalid or missing verification token.'
      );

      return;
    }

    const verify = async () => {

      try {

        const res = await fetch(
          `${API_URL}/auth/verify-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json'
            },
            body: JSON.stringify({
              token
            })
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
            'Verification failed'
          );
        }

        setStatus('success');

        setMessage(data.message);

        setTimeout(() => {
          navigate('/login');
        }, 3000);

      } catch (err) {

        setStatus('error');

        setMessage(err.message);
      }
    };

    verify();

  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white relative overflow-hidden flex items-center justify-center px-6">

      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      {/* AMBIENT */}
      <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-white opacity-[0.03] blur-[120px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-lg">

        {/* MAIN CARD */}
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-10 md:p-12 text-center">

          {/* INNER GLOW */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>

          {/* LOADING */}
          {status === 'loading' && (

            <div className="relative z-10 flex flex-col items-center">

              <div className="w-24 h-24 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center mb-8">

                <Loader2
                  size={40}
                  className="animate-spin text-white"
                />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-6">

                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>

                <span className="text-sm text-zinc-300">
                  Secure Verification Protocol
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight leading-tight">

                Verifying

                <br />

                <span className="text-zinc-500">
                  Identity
                </span>
              </h1>

              <p className="text-zinc-500 mt-6 leading-relaxed max-w-md">
                Please wait while we securely
                authenticate and verify your
                VotePulse account credentials.
              </p>
            </div>
          )}

          {/* SUCCESS */}
          {status === 'success' && (

            <div className="relative z-10 flex flex-col items-center">

              <div className="relative mb-8">

                <div className="absolute inset-0 bg-emerald-400 opacity-20 blur-3xl rounded-full"></div>

                <div className="relative w-24 h-24 rounded-full border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center">

                  <CheckCircle
                    size={42}
                    className="text-emerald-400"
                  />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 mb-6">

                <ShieldCheck
                  size={16}
                  className="text-emerald-400"
                />

                <span className="text-sm text-emerald-300">
                  Verification Successful
                </span>
              </div>

              <h1 className="text-5xl font-bold tracking-tight leading-tight">

                Email

                <br />

                <span className="text-zinc-500">
                  Verified
                </span>
              </h1>

              <p className="text-zinc-500 mt-6 leading-relaxed max-w-md">

                {message}
              </p>

              <div className="mt-10 flex items-center gap-3 text-zinc-400 text-sm">

                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Redirecting to login...
              </div>
            </div>
          )}

          {/* ERROR */}
          {status === 'error' && (

            <div className="relative z-10 flex flex-col items-center">

              <div className="relative mb-8">

                <div className="absolute inset-0 bg-red-500 opacity-20 blur-3xl rounded-full"></div>

                <div className="relative w-24 h-24 rounded-full border border-red-500/20 bg-red-500/10 flex items-center justify-center">

                  <XCircle
                    size={42}
                    className="text-red-400"
                  />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/10 mb-6">

                <span className="w-2 h-2 rounded-full bg-red-400"></span>

                <span className="text-sm text-red-300">
                  Verification Failed
                </span>
              </div>

              <h1 className="text-5xl font-bold tracking-tight leading-tight">

                Access

                <br />

                <span className="text-zinc-500">
                  Denied
                </span>
              </h1>

              <p className="text-zinc-500 mt-6 leading-relaxed max-w-md">

                {message}
              </p>

              <Link
                to="/register"
                className="group mt-10 w-full h-16 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all flex items-center justify-center gap-3 font-medium"
              >

                Back to Registration

                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;