import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { api } from '../../api/client';

const defaultColor = '#1f2937';

export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [iconColor, setIconColor] = useState(defaultColor);
  const [editIconColor, setEditIconColor] = useState(defaultColor);
  const [editingTool, setEditingTool] = useState(null);
  const [newTypeName, setNewTypeName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      tool_type_id: '',
      tool_category_id: '',
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
  } = useForm({
    defaultValues: {
      name: '',
      tool_type_id: '',
      tool_category_id: '',
    },
  });

  useEffect(() => {
    let active = true;
    async function fetchAll() {
      try {
        const [toolRes, typeRes, categoryRes] = await Promise.all([
          api.get('/tools?per_page=100'),
          api.get('/tool-types'),
          api.get('/tool-categories'),
        ]);

        if (!active) return;

        setTools(toolRes?.data?.data ?? toolRes?.data ?? []);
        setTypes(typeRes?.data ?? []);
        setCategories(categoryRes?.data ?? []);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      active = false;
    };
  }, []);

  const onCreate = handleSubmit(async (values) => {
    try {
      const payload = {
        ...values,
        icon_color: iconColor || defaultColor,
      };
      const { data } = await api.post('/tools', payload);
      setTools((prev) => [...prev, data]);
      reset();
      setIconColor(defaultColor);
      toast.success('Tool ditambahkan');
    } catch (error) {
      const message = error.response?.data?.message ?? 'Gagal menambahkan tool';
      toast.error(message);
    }
  });

  const onEdit = handleSubmitEdit(async (values) => {
    if (!editingTool) return;
    try {
      const payload = {
        ...values,
        icon_color: editIconColor || defaultColor,
      };
      const { data } = await api.put(`/tools/${editingTool.id}`, payload);
      setTools((prev) => prev.map((item) => (item.id === data.id ? data : item)));
      setEditingTool(null);
      setEditIconColor(defaultColor);
      toast.success('Tool diperbarui');
    } catch (error) {
      const message = error.response?.data?.message ?? 'Gagal memperbarui tool';
      toast.error(message);
    }
  });

  const removeTool = async (toolId) => {
    if (!window.confirm('Hapus tool ini?')) return;
    try {
      await api.delete(`/tools/${toolId}`);
      setTools((prev) => prev.filter((item) => item.id !== toolId));
      toast.success('Tool dihapus');
    } catch (error) {
      const message = error.response?.data?.message ?? 'Gagal menghapus tool';
      toast.error(message);
    }
  };

  const startEdit = (tool) => {
    setEditingTool(tool);
    resetEdit({
      name: tool.name,
      tool_type_id: tool.tool_type_id ?? '',
      tool_category_id: tool.tool_category_id ?? '',
    });
    setEditIconColor(tool.icon_color ?? defaultColor);
  };

  const quickAddType = async () => {
    if (!newTypeName.trim()) return;
    try {
      const { data } = await api.post('/tool-types', { name: newTypeName.trim() });
      setTypes((prev) => [...prev, data]);
      setNewTypeName('');
      toast.success('Jenis tool ditambahkan');
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Gagal menambah jenis');
    }
  };

  const quickAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const { data } = await api.post('/tool-categories', { name: newCategoryName.trim() });
      setCategories((prev) => [...prev, data]);
      setNewCategoryName('');
      toast.success('Kategori tool ditambahkan');
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Gagal menambah kategori');
    }
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Memuat data tools...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Tools</h2>
          <p className="text-sm text-gray-500">Kelola daftar tools, jenis, dan kategori.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Nama</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Jenis</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Kategori</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Warna</th>
                <th className="px-4 py-2 text-right font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tools.map((tool) => (
                <tr key={tool.id}>
                  <td className="px-4 py-2 font-medium text-gray-800">{tool.name}</td>
                  <td className="px-4 py-2 text-gray-600">{tool.type ?? tool.type_name ?? tool.type}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {tool.category ?? tool.category_name ?? tool.category}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className="inline-flex h-6 w-6 rounded-full border"
                      style={{ backgroundColor: tool.icon_color ?? defaultColor }}
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(tool)}
                        className="rounded bg-indigo-500 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTool(tool.id)}
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

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tambah Tool</h3>
            <form onSubmit={onCreate} className="space-y-3">
              <input
                placeholder="Nama tool"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...register('name', { required: true })}
              />
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...register('tool_type_id', { required: true })}
              >
                <option value="">Pilih jenis</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...register('tool_category_id', { required: true })}
              >
                <option value="">Pilih kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                <label className="text-sm font-medium text-gray-700">Warna Icon</label>
                <input
                  type="color"
                  value={iconColor}
                  onChange={(event) => setIconColor(event.target.value)}
                  className="h-10 w-16 cursor-pointer rounded border border-gray-300"
                />
              </div>
              <button className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700">
                Simpan
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Add</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="Nama jenis"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={quickAddType}
                  className="rounded bg-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-400"
                >
                  + Jenis
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nama kategori"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={quickAddCategory}
                  className="rounded bg-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-400"
                >
                  + Kategori
                </button>
              </div>
            </div>
          </div>

          {editingTool && (
            <form
              onSubmit={onEdit}
              className="space-y-4 rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Tool</h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTool(null);
                    setEditIconColor(defaultColor);
                  }}
                  className="text-xs font-semibold text-red-500 hover:text-red-600"
                >
                  Tutup
                </button>
              </div>
              <input
                placeholder="Nama tool"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...registerEdit('name', { required: true })}
              />
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...registerEdit('tool_type_id', { required: true })}
              >
                <option value="">Pilih jenis</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...registerEdit('tool_category_id', { required: true })}
              >
                <option value="">Pilih kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                <label className="text-sm font-medium text-gray-700">Warna Icon</label>
                <input
                  type="color"
                  value={editIconColor}
                  onChange={(event) => setEditIconColor(event.target.value)}
                  className="h-10 w-16 cursor-pointer rounded border border-gray-300"
                />
              </div>
              <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
                Update
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
