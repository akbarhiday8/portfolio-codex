import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      username: user?.username ?? '',
      password: '',
      password_confirmation: '',
    },
  });

  useEffect(() => {
    reset({
      username: user?.username ?? '',
      password: '',
      password_confirmation: '',
    });
  }, [user, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await api.put('/settings/account', values);
      toast.success('Akun diperbarui');
      reset({ username: values.username, password: '', password_confirmation: '' });
    } catch (error) {
      const message = error.response?.data?.message ?? 'Gagal memperbarui akun';
      toast.error(message);
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Pengaturan Akun</h2>
        <p className="text-sm text-gray-500">Ganti username dan password administrator.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            {...register('username', { required: true })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password Baru</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            {...register('password')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            {...register('password_confirmation')}
          />
          <p className="mt-1 text-xs text-gray-500">
            Kosongkan password bila tidak ingin mengubah. Pastikan konfirmasi sesuai.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-70"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </form>
    </div>
  );
}
