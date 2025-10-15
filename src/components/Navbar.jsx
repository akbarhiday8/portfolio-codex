import React, { useState, useEffect, useRef } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Tools', href: '#tools' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isOpen) return;
      const target = event.target;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('click', handleClickOutside);
    }

    return () => window.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    toggleRef.current?.focus();
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/75 dark:bg-gray-800/75 shadow-lg backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href="#home"
            className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
              isScrolled
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-900 dark:text-white'
            }`}
            onClick={closeMenu}
          >
            PORTFOLIO
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className={`px-3 py-2 text-base lg:text-lg font-medium transition-colors duration-300 hover:scale-105 ${
                isScrolled
                  ? 'text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400'
                  : 'text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`px-3 py-2 text-base lg:text-lg font-medium transition-colors duration-300 hover:scale-105 ${
                isScrolled
                  ? 'text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400'
                  : 'text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400'
              }`}
            >
              Tentang
            </button>
            <button
              onClick={() => scrollToSection('tools')}
              className={`px-3 py-2 text-base lg:text-lg font-medium transition-colors duration-300 hover:scale-105 ${
                isScrolled
                  ? 'text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400'
                  : 'text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400'
              }`}
            >
              Tools
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className={`px-3 py-2 text-base lg:text-lg font-medium transition-colors duration-300 hover:scale-105 ${
                isScrolled
                  ? 'text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400'
                  : 'text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400'
              }`}
            >
              Proyek
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`px-3 py-2 text-base lg:text-lg font-medium transition-colors duration-300 hover:scale-105 ${
                isScrolled
                  ? 'text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400'
                  : 'text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400'
              }`}
            >
              Kontak
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            ref={toggleRef}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled
                ? 'text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400'
                : 'text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400'
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {isOpen ? (
              <XMarkIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            ) : (
              <Bars3Icon className="h-7 w-7 sm:h-8 sm:w-8" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          ref={menuRef}
          className={`md:hidden absolute left-0 right-0 top-16 sm:top-20 transition-all duration-300 ${
            isOpen
              ? 'opacity-100 visible translate-y-0'
              : 'opacity-0 invisible -translate-y-2'
          }`}
        >
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg rounded-b-2xl mx-4 overflow-hidden">
            <div className="px-4 py-3 space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-base sm:text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
                  onClick={closeMenu}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
