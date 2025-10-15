import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../../api/client';
import MultipleUpload from '../../components/Upload/MultipleUpload';

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [features, setFeatures] = useState(['']);
  const [selectedTools, setSelectedTools] = useState([]);
  const { register, handleSubmit } = useForm({
    defaultValues: { name: '', description: '', link_url: '', project_category_id: '' },
  });

  useEffect(() => {
    Promise.all([api.get('/tools?per_page=100'), api.get('/project-categories')]).then(
      ([toolsRes, categoriesRes]) => {
        setTools(toolsRes?.data?.data ?? toolsRes?.data ?? []);
        setCategories(categoriesRes?.data ?? []);
      }
    );
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = {
        ...values,
        tool_ids: selectedTools,
        features: features.filter((item) => item.trim().length > 0),
      };

      const { data } = await api.post('/projects', payload);
      const project = data?.data ?? data;

      if (images.length) {
        const formData = new FormData();
        images.slice(0, 7).forEach((file) => formData.append('images[]', file));
        await api.post(`/projects/${project.id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('Proyek ditambahkan');
      navigate('/projects');
    } catch (error) {
      const message = error.response?.data?.message ?? 'Gagal menyimpan proyek';
      toast.error(message);
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Tambah Proyek</h2>
          <p className="text-sm text-gray-500">Isi detail proyek dan unggah hingga 7 foto.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Proyek</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              {...register('name', { required: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Link Proyek</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              {...register('link_url')}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Kategori Proyek</label>
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            {...register('project_category_id', { required: true })}
          >
            <option value="">Pilih kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            {...register('description')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tools</label>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {tools.map((tool, index) => (
              <label
                key={`${tool.id ?? tool.tool_id ?? tool.name}-${index}`}
                className="flex items-center gap-2 rounded border border-gray-200 px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedTools.includes(tool.id)}
                  onChange={(event) =>
                    setSelectedTools((prev) =>
                      event.target.checked ? [...prev, tool.id] : prev.filter((id) => id !== tool.id)
                    )
                  }
                />
                <span>{tool.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Fitur Utama</label>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                value={feature}
                onChange={(event) =>
                  setFeatures((prev) => prev.map((item, idx) => (idx === index ? event.target.value : item)))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder={`Fitur ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => setFeatures((prev) => prev.filter((_, idx) => idx !== index))}
                className="rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFeatures((prev) => [...prev, ''])}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            + Tambah Fitur
          </button>
        </div>

        <MultipleUpload files={images} setFiles={setImages} limit={7} />

        <div className="flex justify-end">
          <button className="inline-flex items-center rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-700">
            Simpan Proyek
          </button>
        </div>
      </form>
    </div>
  );
}
