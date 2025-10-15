import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { api } from '../../api/client';

export default function ToolCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: '' } });

  useEffect(() => {
    let active = true;
    api
      .get('/tool-categories')
      .then(({ data }) => {
        if (active) setCategories(data ?? []);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const addCategory = handleSubmit(async (values) => {
    try {
      const { data } = await api.post('/tool-categories', values);
      setCategories((prev) => [...prev, data]);
      reset();
      toast.success('Kategori ditambahkan');
    } catch (error) {
      const message = error.response?.data?.message ?? 'Gagal menambahkan kategori';
      toast.error(message);
    }
  });

  const saveCategory = async () => {
    if (!editing) return;
    try {
      const { data } = await api.put(`/tool-categories/${editing.id}`, { name: editing.name });
      setCategories((prev) => prev.map((item) => (item.id === data.id ? data : item)));
      setEditing(null);
      toast.success('Kategori diperbarui');
    } catch (error) {
      const message = error.response?.data?.message ?? 'Gagal memperbarui kategori';
      toast.error(message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/tool-categories/${id}`);
      setCategories((prev) => prev.filter((item) => item.id !== id));
      toast.success('Kategori dihapus');
    } catch (error) {
      const message = error.response?.data?.message ?? 'Gagal menghapus kategori';
      toast.error(message);
    }
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Memuat data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Kategori Tools</h2>
        <p className="text-sm text-gray-500">Kelola kategori detail (contoh: Website, Landing Page).</p>
      </div>

      <form onSubmit={addCategory} className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row">
        <input
          placeholder="Nama kategori"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          {...register('name', { required: true })}
        />
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
          Tambah Kategori
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Kategori</th>
              <th className="px-4 py-2 text-right font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => {
              const isEditing = editing?.id === category.id;
              return (
                <tr key={category.id}>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        value={editing.name}
                        onChange={(event) =>
                          setEditing((prev) => ({ ...prev, name: event.target.value }))
                        }
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    ) : (
                      <span className="font-medium text-gray-800">{category.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={saveCategory}
                          className="rounded bg-green-500 px-3 py-1 text-xs font-semibold text-white hover:bg-green-600"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          className="rounded bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-300"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditing({ ...category })}
                          className="rounded bg-indigo-500 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCategory(category.id)}
                          className="rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
