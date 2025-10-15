import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { profile: currentProfile, setProfile: setAuthProfile } = useAuth();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      title: '',
      motto: '',
      about: '',
    },
  });
  const [profile, setProfile] = useState(currentProfile);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState({
    photo: null,
    cv: null,
    portfolio: null,
  });

  useEffect(() => {
    let active = true;
    setLoading(true);

    api
      .get('/profile')
      .then(({ data }) => {
        const record = data?.data?.[0] ?? null;
        if (!active) return;
        setProfile(record);
        if (record) {
          reset({
            name: record.name ?? '',
            title: record.title ?? '',
            motto: record.motto ?? '',
            about: record.about ?? '',
          });
        }
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [reset]);

  const onSubmit = handleSubmit(async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value ?? '')
    );

    if (files.photo) formData.append('photo', files.photo);
    if (files.cv) formData.append('cv', files.cv);
    if (files.portfolio) formData.append('portfolio', files.portfolio);

    try {
      let response;
      if (profile?.id) {
        formData.append('_method', 'PUT');
        response = await api.post(`/profile/${profile.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.post('/profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      const updated = response.data?.data ?? response.data;
      setProfile(updated);
      setAuthProfile(updated);
      toast.success('Profil diperbarui');
      setFiles({ photo: null, cv: null, portfolio: null });
    } catch (error) {
      const message = error.response?.data?.message ?? 'Gagal menyimpan profil';
      toast.error(message);
    }
  });

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        Memuat data profil...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Profil</h2>
        <p className="text-sm text-gray-500">
          Perbarui informasi profil, foto, dan dokumen pendukung.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              {...register('name', { required: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Jabatan
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              {...register('title')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Motto
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              {...register('motto')}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tentang
          </label>
          <textarea
            rows={5}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            {...register('about')}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FileInput
            label="Foto Profil"
            accept="image/*"
            onChange={(file) => setFiles((prev) => ({ ...prev, photo: file }))}
            existingUrl={profile?.photo_url}
          />
          <FileInput
            label="File CV (PDF/ZIP)"
            accept=".pdf,.zip"
            onChange={(file) => setFiles((prev) => ({ ...prev, cv: file }))}
            existingUrl={profile?.cv_url}
          />
          <FileInput
            label="File Portfolio (PDF/ZIP)"
            accept=".pdf,.zip"
            onChange={(file) =>
              setFiles((prev) => ({ ...prev, portfolio: file }))
            }
            existingUrl={profile?.portfolio_file_url}
          />
        </div>

        <div className="flex justify-end">
          <button className="inline-flex items-center rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-700">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}

function FileInput({ label, accept, onChange, existingUrl }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        accept={accept}
        className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      {existingUrl ? (
        <a
          href={existingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Lihat file saat ini
        </a>
      ) : (
        <p className="mt-2 text-xs text-gray-500">Belum ada file</p>
      )}
    </div>
  );
}
