import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const { data } = await api.get('/api/hackathon/my-entry');
        setEntry(data.registration || null);
      } catch {
        setEntry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome, {user?.fullName || 'Participant'}</h1>
          </div>
          {!entry && (
            <Link to="/register" className="inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500">Register Now</Link>
          )}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 font-medium text-slate-900">{user?.email}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Verification</p>
            <p className="mt-2 font-medium text-slate-900">{user?.isVerified ? 'Verified' : 'Pending'}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Registration</p>
            <p className="mt-2 font-medium text-slate-900">{entry ? 'Registered' : 'Not registered'}</p>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 text-slate-600">Loading registration details...</div>
        ) : entry ? (
          <div className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Your registration</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="text-sm text-slate-500">Project Name</p><p className="font-medium text-slate-900">{entry.projectName}</p></div>
              <div><p className="text-sm text-slate-500">Domain</p><p className="font-medium text-slate-900">{entry.domain}</p></div>
              <div><p className="text-sm text-slate-500">College</p><p className="font-medium text-slate-900">{entry.collegeName}</p></div>
              <div><p className="text-sm text-slate-500">Team Size</p><p className="font-medium text-slate-900">{entry.teamSize}</p></div>
            </div>
            {entry.teamMembers?.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Team members</p>
                <ul className="space-y-2 text-slate-700">
                  {entry.teamMembers.map((member, idx) => (
                    <li key={idx} className="rounded-xl border border-slate-200 bg-white px-3 py-2">{member.name} — {member.email}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            You have not registered for the hackathon yet. Start your application by clicking the button above.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
