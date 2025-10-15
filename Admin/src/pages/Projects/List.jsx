import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../../api/client';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .get('/projects?per_page=50')
      .then(({ data }) => {
        if (active) setProjects(data?.data ?? data ?? []);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const deleteProject = async (id) => {
    if (!window.confirm('Yakin ingin menghapus proyek ini?')) return;

    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((project) => project.id !== id));
      toast.success('Proyek dihapus');
    } catch (error) {
      const message = error.response?.data?.message ?? 'Gagal menghapus proyek';
      toast.error(message);
    }
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Memuat data proyek...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Proyek</h2>
          <p className="text-sm text-gray-500">Kelola daftar proyek beserta kategori dan tools.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/projects/categories"
            className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Kelola Kategori
          </Link>
          <Link
            to="/projects/new"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            + Tambah Proyek
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Nama</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Kategori</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Tools</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Link</th>
              <th className="px-4 py-2 text-right font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-4 py-2 font-medium text-gray-800">{project.name}</td>
                <td className="px-4 py-2 text-gray-600">{project.category?.name ?? '-'}</td>
                <td className="px-4 py-2 text-gray-600">
                  {project.tools?.map((tool) => tool.name).join(', ') || '-'}
                </td>
                <td className="px-4 py-2 text-gray-600 underline">
                  {project.link_url ? (
                    <a href={project.link_url} target="_blank" rel="noopener noreferrer">
                      {project.link_url}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/projects/${project.id}`}
                      className="rounded bg-indigo-500 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-400"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteProject(project.id)}
                      className="rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
