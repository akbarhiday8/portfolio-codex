import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleButtonRef = useRef(null);
  const previouslyOpenRef = useRef(sidebarOpen);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (previouslyOpenRef.current && !sidebarOpen) {
      toggleButtonRef.current?.focus();
    }
    previouslyOpenRef.current = sidebarOpen;
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex w-full flex-col">
        <header className="flex flex-col gap-3 border-b bg-white px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between md:block">
            <button
              type="button"
              ref={toggleButtonRef}
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 md:hidden"
              aria-label="Buka menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">
                Halo, {user?.name ?? 'Admin'}
              </h1>
              <p className="text-sm text-gray-500">Kelola konten portfolio kamu di sini.</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
