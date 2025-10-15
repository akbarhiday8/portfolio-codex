import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const generateChallenge = () => {
  const first = Math.floor(Math.random() * 6) + 2;
  const second = Math.floor(Math.random() * 6) + 2;
  return {
    first,
    second,
    answer: first + second,
  };
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState,
    resetField,
    watch,
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      identifier: '',
      password: '',
      confirmation: '',
      challengeAnswer: '',
    },
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    if (!cooldownUntil) {
      setRemainingSeconds(0);
      return undefined;
    }

    const tick = () => {
      const diff = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setRemainingSeconds(diff);
      if (diff <= 0) {
        setCooldownUntil(null);
        setFailedAttempts(0);
        resetField('challengeAnswer');
        setChallenge(null);
      }
    };

    tick();
    const interval = window.setInterval(tick, 500);
    return () => window.clearInterval(interval);
  }, [cooldownUntil, resetField]);

  const cooldownActive = useMemo(() => remainingSeconds > 0, [remainingSeconds]);
  const honeypotValue = watch('confirmation');
  const challengeAnswer = watch('challengeAnswer');

  const onSubmit = handleSubmit(async ({ identifier, password }) => {
    if (honeypotValue) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
      return;
    }

    if (cooldownActive) {
      toast.error(`Tunggu ${remainingSeconds}s sebelum mencoba lagi.`);
      return;
    }

    if (challenge) {
      const numericAnswer = Number.parseInt(challengeAnswer ?? '', 10);
      if (Number.isNaN(numericAnswer) || numericAnswer !== challenge.answer) {
        toast.error('Jawaban verifikasi tidak tepat.');
        return;
      }
    }

    try {
      const payload = identifier.includes('@')
        ? { email: identifier, password }
        : { username: identifier, password };
      await login(payload);
      toast.success('Berhasil masuk');
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true });
      setFailedAttempts(0);
      setChallenge(null);
      resetField('challengeAnswer');
    } catch (error) {
      const message = error.response?.data?.message ?? 'Email/username atau password salah';
      toast.error(message);

      setFailedAttempts((prev) => {
        const next = prev + 1;
        if (next >= 3 && !challenge) {
          setChallenge(generateChallenge());
        }
        if (next >= 5) {
          const extraPenalty = Math.min(90, (next - 4) * 15 + 30);
          setCooldownUntil(Date.now() + extraPenalty * 1000);
          setRemainingSeconds(extraPenalty);
        }
        return next;
      });
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold text-gray-900">Admin Login</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Masuk untuk mengelola konten portfolio kamu.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <input
            type="text"
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
            autoComplete="off"
            {...register('confirmation')}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="identifier">
              Email atau Username
            </label>
            <input
              id="identifier"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="admin@example.com atau admin"
              autoComplete="username"
              {...register('identifier', { required: true })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Password"
                autoComplete="current-password"
                {...register('password', { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-pressed={showPassword}
                className="absolute right-3 text-xs font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2"
              >
                {showPassword ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
          </div>

          {challenge ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="challengeAnswer">
                Verifikasi cepat &mdash; berapa hasil {challenge.first} + {challenge.second}?
              </label>
              <input
                id="challengeAnswer"
                inputMode="numeric"
                className="w-full rounded-lg border border-indigo-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Jawaban kamu"
                {...register('challengeAnswer')}
              />
              <p className="mt-1 text-xs text-gray-500">
                Verifikasi ini membantu melindungi akun kamu dari percobaan login otomatis.
              </p>
            </div>
          ) : null}

          <div aria-live="polite" className="text-sm text-gray-600">
            {cooldownActive ? `Terlalu banyak percobaan. Coba lagi dalam ${remainingSeconds}s.` : null}
          </div>

          <button
            type="submit"
            disabled={formState.isSubmitting || cooldownActive}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {formState.isSubmitting ? 'Memproses...' : 'Masuk'}
          </button>

          {failedAttempts > 0 && !cooldownActive ? (
            <p className="text-center text-xs text-gray-500" aria-live="polite">
              Percobaan gagal: {failedAttempts}. Pastikan email/username dan password benar.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
