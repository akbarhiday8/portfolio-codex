import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { api } from '../../api/client';

export default function ProjectCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: '', description: '' } });

  useEffect(() => {
    let active = true;
    api
      .get('/project-categories')
      .then(({ data }) => {
        if (active) setCategories(data ?? []);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const submit = handleSubmit(async (values) => {
    try {
      if (editing) {
        const { data } = await api.put(`/project-categories/${editing.id}`, values);
        setCategories((prev) => prev.map((item) => (item.id === data.id ? data : item)));
        setEditing(null);
        toast.success('Kategori diperbarui');
      } else {
        const { data } = await api.post('/project-categories', values);
        setCategories((prev) => [...prev, data]);
        toast.success('Kategori ditambahkan');
      }
      reset({ name: '', description: '' });
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Operasi gagal');
    }
  });

  const startEdit = (category) => {
    setEditing(category);
    reset({ name: category.name, description: category.description ?? '' });
  };

  const remove = async (category) => {
    if (!window.confirm('Hapus kategori ini?')) return;
    try {
      await api.delete(`/project-categories/${category.id}`);
      setCategories((prev) => prev.filter((item) => item.id !== category.id));
      toast.success('Kategori dihapus');
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Gagal menghapus kategori');
    }
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Memuat kategori...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Kategori Proyek</h2>
          <p className="text-sm text-gray-500">Kelola kategori proyek (Website, Landing Page, dsb).</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr,1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Nama</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Deskripsi</th>
                <th className="px-4 py-2 text-right font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-4 py-2 font-medium text-gray-800">{category.name}</td>
                  <td className="px-4 py-2 text-gray-600">{category.description ?? '-'}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        className="rounded bg-indigo-500 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(category)}
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

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  reset({ name: '', description: '' });
                }}
                className="text-xs font-semibold text-red-500 hover:text-red-600"
              >
                Batalkan
              </button>
            )}
          </div>
          <input
            placeholder="Nama kategori"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            {...register('name', { required: true })}
          />
          <textarea
            rows={3}
            placeholder="Deskripsi (opsional)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            {...register('description')}
          />
          <button className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700">
            {editing ? 'Update Kategori' : 'Tambah Kategori'}
          </button>
        </form>
      </div>
    </div>
  );
}
