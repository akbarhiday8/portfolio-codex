import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { api } from '../api/client';

export default function AboutPage() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { about: '' },
  });
  const {
    register: registerSkill,
    handleSubmit: handleSubmitSkill,
    reset: resetSkill,
  } = useForm({
    defaultValues: { name: '', level: '' },
  });

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const [profileRes, skillRes] = await Promise.all([
          api.get('/profile'),
          api.get('/skills'),
        ]);
        if (!active) return;
        const profileData = profileRes?.data?.data?.[0] ?? null;
        setProfile(profileData);
        reset({ about: profileData?.about ?? '' });
        setSkills(skillRes?.data ?? []);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();
    return () => {
      active = false;
    };
  }, [reset]);

  const submitAbout = handleSubmit(async ({ about }) => {
    if (!profile) {
      toast.error(
        'Profil belum dibuat. Silakan isi halaman Profil terlebih dahulu.'
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', profile.name ?? '');
      formData.append('title', profile.title ?? '');
      formData.append('motto', profile.motto ?? '');
      formData.append('about', about ?? '');
      formData.append('_method', 'PUT');

      const { data } = await api.post(`/profile/${profile.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(data?.data ?? data);
      toast.success('Deskripsi diperbarui');
    } catch (error) {
      const message =
        error.response?.data?.message ?? 'Gagal memperbarui deskripsi';
      toast.error(message);
    }
  });

  const addSkill = handleSubmitSkill(async (values) => {
    try {
      const payload = {
        ...values,
        level: values.level ? Number(values.level) : null,
      };
      const { data } = await api.post('/skills', payload);
      setSkills((prev) => [...prev, data]);
      resetSkill();
      toast.success('Skill ditambahkan');
    } catch (error) {
      const message =
        error.response?.data?.message ?? 'Gagal menambahkan skill';
      toast.error(message);
    }
  });

  const saveSkill = async () => {
    if (!editingSkill) return;
    try {
      const payload = {
        name: editingSkill.name,
        level: editingSkill.level ? Number(editingSkill.level) : null,
      };
      const { data } = await api.put(`/skills/${editingSkill.id}`, payload);
      setSkills((prev) =>
        prev.map((item) => (item.id === data.id ? data : item))
      );
      setEditingSkill(null);
      toast.success('Skill diperbarui');
    } catch (error) {
      const message =
        error.response?.data?.message ?? 'Gagal memperbarui skill';
      toast.error(message);
    }
  };

  const deleteSkill = async (skillId) => {
    try {
      await api.delete(`/skills/${skillId}`);
      setSkills((prev) => prev.filter((item) => item.id !== skillId));
      toast.success('Skill dihapus');
    } catch {
      toast.error('Gagal menghapus skill');
    }
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Memuat data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Skill</h2>
        <p className="text-sm text-gray-500">Kelola daftar skill.</p>
      </div>

      {/* <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Deskripsi Tentang Saya</h3>
        <form onSubmit={submitAbout} className="space-y-3">
          <textarea
            rows={6}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            {...register('about')}
          />
          <button className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700">
            Simpan Deskripsi
          </button>
        </form>
      </section> */}

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Daftar Skill</h3>
        </div>

        <form
          onSubmit={addSkill}
          className="grid gap-3 md:grid-cols-[2fr,1fr,auto]"
        >
          <input
            placeholder="Nama skill"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            {...registerSkill('name', { required: true })}
          />
          <input
            type="number"
            min="0"
            max="100"
            placeholder="Level (%)"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            {...registerSkill('level')}
          />
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
            Tambah
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500">
                  Skill
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">
                  Level
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {skills.map((skill) => {
                const isEditing = editingSkill?.id === skill.id;
                return (
                  <tr key={skill.id}>
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <input
                          value={editingSkill.name}
                          onChange={(event) =>
                            setEditingSkill((prev) => ({
                              ...prev,
                              name: event.target.value,
                            }))
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      ) : (
                        <span className="font-medium text-gray-800">
                          {skill.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editingSkill.level ?? ''}
                          onChange={(event) =>
                            setEditingSkill((prev) => ({
                              ...prev,
                              level: event.target.value,
                            }))
                          }
                          className="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      ) : (
                        <span>{skill.level ?? '-'}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={saveSkill}
                            className="rounded bg-green-500 px-3 py-1 text-xs font-semibold text-white hover:bg-green-600"
                          >
                            Simpan
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSkill(null)}
                            className="rounded bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-300"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingSkill({ ...skill })}
                            className="rounded bg-indigo-500 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-400"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSkill(skill.id)}
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
      </section>
    </div>
  );
}
