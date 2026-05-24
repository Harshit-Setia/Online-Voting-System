import React, { useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import {
  Shield,
  ArrowLeft,
  ArrowRight,
  FileText,
  CalendarDays,
  Clock3
} from 'lucide-react';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import {
  ThemeProvider,
  createTheme
} from '@mui/material/styles';

import dayjs from 'dayjs';

import { API_URL } from '../config';

const AddElection = () => {

  const navigate = useNavigate();
  const { electionId } = useParams();
  const isEditMode = !!electionId;

  const [formData, setFormData] = useState(() => {
    const now = dayjs();
    const minEnd = now.add(1, 'hour');
    return {
      title: '',
      description: '',
      start_date: now,
      start_time: now,
      end_date: minEnd,
      end_time: minEnd
    };
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchElection = async () => {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        try {
          const res = await fetch(`${API_URL}/elections/${electionId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || 'Failed to load election details');
          }
          
          const start = dayjs(data.start_time);
          const end = dayjs(data.end_time);

          setFormData({
            title: data.title,
            description: data.description || '',
            start_date: start,
            start_time: start,
            end_date: end,
            end_time: end
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchElection();
    }
  }, [electionId, isEditMode]);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError('');

    setSuccess('');

    const token = localStorage.getItem('token');

    if (!token) {

      setError('Not authenticated');

      setLoading(false);

      return;
    }

    try {

      if (
        !formData.start_date ||
        !formData.start_time ||
        !formData.end_date ||
        !formData.end_time
      ) {
        throw new Error(
          'Please select both date and time.'
        );
      }

      const startDayjs = dayjs(formData.start_date)
        .hour(dayjs(formData.start_time).hour())
        .minute(dayjs(formData.start_time).minute())
        .second(0)
        .millisecond(0);

      const endDayjs = dayjs(formData.end_date)
        .hour(dayjs(formData.end_time).hour())
        .minute(dayjs(formData.end_time).minute())
        .second(0)
        .millisecond(0);

      if (!isEditMode && startDayjs.isBefore(dayjs().subtract(5, 'minute'))) {
        throw new Error('Election start time cannot be in the past.');
      }

      if (endDayjs.isBefore(startDayjs.add(1, 'hour'))) {
        throw new Error('Election end time must be at least 1 hour after the start time.');
      }

      const start = startDayjs.toISOString();
      const end = endDayjs.toISOString();

      const payload = {
        title: formData.title,
        description: formData.description,
        start_time: start,
        end_time: end
      };

      const url = isEditMode ? `${API_URL}/elections/${electionId}` : `${API_URL}/elections`;
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(
        url,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          (isEditMode ? 'Failed to update election' : 'Failed to create election')
        );
      }

      setSuccess(
        isEditMode
          ? 'Election updated successfully!'
          : 'Election launched successfully!'
      );

      if (!isEditMode) {
        setFormData({
          title: '',
          description: '',
          start_date: null,
          start_time: null,
          end_date: null,
          end_time: null
        });
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  };

  /* MUI THEME */
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ffffff'
      },
      background: {
        paper: '#111111'
      }
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            backgroundColor: '#111111',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'white',

            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor:
                'rgba(255,255,255,0.15)'
            },

            '&.Mui-focused .MuiOutlinedInput-notchedOutline':
              {
                borderColor: '#ffffff'
              },

            '.MuiOutlinedInput-notchedOutline': {
              border: 'none'
            }
          },

          input: {
            padding: '16px'
          }
        }
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#a1a1aa'
          }
        }
      }
    }
  });
  const isSameDay = formData.start_date && formData.end_date && dayjs(formData.start_date).isSame(dayjs(formData.end_date), 'day');
  const minEndTime = isSameDay && formData.start_time ? dayjs(formData.start_time).add(1, 'hour') : undefined;

  return (
    <ThemeProvider theme={darkTheme}>

      <LocalizationProvider
        dateAdapter={AdapterDayjs}
      >

        <div className="min-h-screen bg-[#0B0B0B] text-white relative overflow-hidden">

          {/* GRID */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

          {/* AMBIENT */}
          <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-white opacity-[0.03] blur-[120px] rounded-full"></div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

            {/* BACK BUTTON */}
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
                  {isEditMode ? 'Edit Election Details' : 'Election Command Center'}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">

                {isEditMode ? 'Edit' : 'Launch New'}

                <br />

                <span className="text-zinc-500">
                  Election
                </span>
              </h1>

              <p className="text-zinc-500 text-lg mt-6 max-w-2xl leading-relaxed">
                {isEditMode
                  ? 'Update election title, description, and voting period schedules.'
                  : 'Configure secure election timelines, voting schedules and participation details.'}
              </p>
            </div>

            {/* FORM CARD */}
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 md:p-10">

              {/* ALERTS */}
              {error && (
                <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">

                  {error}
                </div>
              )}

              {success && (
                <div className="mb-8 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">

                  {success}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-8"
              >

                {/* TITLE */}
                <div>

                  <label className="text-xs uppercase tracking-wider text-zinc-500">

                    Election Title
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="2026 Student Council Election"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value
                      })
                    }
                    className="mt-3 w-full h-16 rounded-2xl bg-[#111111] border border-white/10 px-5 text-white placeholder:text-zinc-600 outline-none focus:border-white transition-all"
                  />
                </div>

                {/* DESCRIPTION */}
                <div>

                  <label className="text-xs uppercase tracking-wider text-zinc-500">

                    Description
                  </label>

                  <div className="relative mt-3">

                    <FileText
                      size={18}
                      className="absolute top-5 left-5 text-zinc-500"
                    />

                    <textarea
                      rows="5"
                      required
                      placeholder="Describe the purpose and details of this election..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description:
                            e.target.value
                        })
                      }
                      className="w-full rounded-2xl bg-[#111111] border border-white/10 pl-14 pr-5 py-5 text-white placeholder:text-zinc-600 outline-none resize-none focus:border-white transition-all"
                    ></textarea>
                  </div>
                </div>

                {/* START */}
                <div>

                  <div className="flex items-center gap-3 mb-5">

                    <CalendarDays
                      size={18}
                      className="text-zinc-400"
                    />

                    <label className="text-xs uppercase tracking-wider text-zinc-500">

                      Election Start
                    </label>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">

                    <DatePicker
                      label="Select Date"
                      format="DD/MM/YYYY"
                      value={formData.start_date}
                      minDate={isEditMode ? undefined : dayjs().startOf('day')}
                      onChange={(newValue) =>
                        setFormData((prev) => {
                          const next = { ...prev, start_date: newValue };
                          if (newValue && prev.end_date && newValue.isAfter(prev.end_date, 'day')) {
                            next.end_date = newValue;
                          }
                          return next;
                        })
                      }
                    />

                    <TimePicker
                      label="Select Time"
                      viewRenderers={{
                        hours:
                          renderTimeViewClock,
                        minutes:
                          renderTimeViewClock
                      }}
                      value={formData.start_time}
                      onChange={(newValue) =>
                        setFormData({
                          ...formData,
                          start_time: newValue
                        })
                      }
                    />
                  </div>
                </div>

                {/* END */}
                <div>

                  <div className="flex items-center gap-3 mb-5">

                    <Clock3
                      size={18}
                      className="text-zinc-400"
                    />

                    <label className="text-xs uppercase tracking-wider text-zinc-500">

                      Election End
                    </label>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">

                    <DatePicker
                      label="Select Date"
                      format="DD/MM/YYYY"
                      value={formData.end_date}
                      minDate={formData.start_date || (isEditMode ? undefined : dayjs().startOf('day'))}
                      onChange={(newValue) =>
                        setFormData({
                          ...formData,
                          end_date: newValue
                        })
                      }
                    />

                    <TimePicker
                      label="Select Time"
                      viewRenderers={{
                        hours:
                          renderTimeViewClock,
                        minutes:
                          renderTimeViewClock
                      }}
                      value={formData.end_time}
                      minTime={minEndTime}
                      onChange={(newValue) =>
                        setFormData({
                          ...formData,
                          end_time: newValue
                        })
                      }
                    />
                  </div>
                </div>

                {/* BUTTON */}
                <div className="pt-4">

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full h-16 rounded-2xl bg-white text-black font-semibold text-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >

                    {loading ? (
                      isEditMode ? 'Updating Election...' : 'Launching Election...'
                    ) : (
                      <>
                        {isEditMode ? 'Save Changes' : 'Launch Election'}

                        <ArrowRight
                          size={20}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default AddElection;