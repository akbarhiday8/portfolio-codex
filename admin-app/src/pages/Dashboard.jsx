import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, tools: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .get('/dashboard/stats')
      .then(({ data }) => {
        if (active) setStats(data);
      })
      .catch(() => {
        if (active) setStats({ projects: 0, skills: 0, tools: 0 });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Memuat statistik...</div>;
  }

  const items = [
    { key: 'projects', label: 'Jumlah Proyek' },
    { key: 'skills', label: 'Jumlah Skill' },
    { key: 'tools', label: 'Jumlah Tools' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">Ringkasan konten portfolio kamu.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map(({ key, label }) => (
          <div key={key} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-gray-500">{label}</div>
            <div className="mt-3 text-4xl font-bold text-gray-900">{stats[key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
