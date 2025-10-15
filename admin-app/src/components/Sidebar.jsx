import React, { useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation();
  const mobileNavRef = useRef(null);
  const closeButtonRef = useRef(null);

  const items = useMemo(
    () => [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/profile', label: 'Profile' },
      { to: '/about', label: 'Tentang & Skill' },
      { to: '/tools', label: 'Tools' },
      { to: '/projects', label: 'Proyek' },
      { to: '/projects/categories', label: 'Kategori Proyek' },
      { to: '/settings', label: 'Setting' },
    ],
    []
  );

  const renderNavLinks = (className = '') =>
    items.map(({ to, label }) => {
      const active = pathname === to || pathname.startsWith(`${to}/`);
      return (
        <Link
          key={to}
          to={to}
          onClick={onClose}
          className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
            active ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
          } ${className}`}
        >
          {label}
        </Link>
      );
    });

  useEffect(() => {
    if (!open) {
      const activeElement = document.activeElement;
      if (mobileNavRef.current?.contains(activeElement) && activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }
  }, [open]);

  return (
    <>
      <aside className="hidden w-64 flex-col border-r bg-white md:flex">
        <div className="px-6 py-5 text-lg font-semibold">Admin Panel</div>
        <nav className="flex-1 space-y-1 px-4 pb-6">{renderNavLinks()}</nav>
      </aside>

      <div
        role="presentation"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        ref={mobileNavRef}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-200 md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={open ? undefined : true}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Tutup menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-6">{renderNavLinks()}</nav>
      </aside>
    </>
  );
}
