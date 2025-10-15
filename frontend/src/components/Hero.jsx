import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Hero = ({ profile, stats }) => {
  const name = profile?.name ?? '';
  const title = profile?.title ?? '';
  const motto = profile?.motto ?? '';
  const about = profile?.about ?? '';
  const photoUrl = profile?.photo_url ?? '/profile-image.webp';
  const cvUrl = profile?.cv_url ?? null;
  const portfolioUrl = profile?.portfolio_file_url ?? null;

  const statsConfig = [
    { key: 'projects', label: 'Projects' },
    { key: 'skills', label: 'Skills' },
    { key: 'tools', label: 'Tools' },
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-[90vh] items-center bg-gray-100 py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 dark:bg-gray-900"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse items-center justify-between gap-10 md:flex-row lg:gap-16">
          <div className="w-full text-center md:w-1/2 md:text-left">
            <div className="mx-auto max-w-2xl space-y-6 md:mx-0">
              <h1 className="text-balance text-4xl font-bold leading-tight text-gray-800 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
                <span className="text-indigo-600 dark:text-indigo-400">
                  Hi, I&apos;m
                </span>{' '}
                <span className="block sm:inline">{name}</span>
              </h1>

              <p className="text-balance text-xl text-gray-600 sm:text-2xl md:text-3xl dark:text-gray-300 tracking-wide">
                {title}
              </p>

              <p className="text-balance text-lg sm:text-xl max-w-xl mx-auto md:mx-0 leading-relaxed text-gray-600 dark:text-gray-400">
                {motto}
              </p>

              {/* <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {about}
              </p> */}

              <div className="flex flex-col items-stretch gap-4 pt-6 sm:flex-row sm:items-center md:justify-start">
                <Menu
                  as="div"
                  className="relative inline-block w-full text-left sm:w-auto"
                >
                  <div>
                    <Menu.Button className="w-full inline-flex items-center justify-center gap-x-1.5 bg-indigo-600 px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-base sm:text-lg md:text-xl font-medium text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg dark:bg-indigo-500 dark:hover:bg-indigo-600 whitespace-nowrap min-w-[160px] sm:min-w-[180px] md:min-w-[200px] text-center">
                      Download
                      <ChevronDownIcon
                        className="ml-1 h-5 w-5"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 right-0 z-10 mt-2 w-full origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 sm:right-auto sm:w-56">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href={cvUrl ?? '#'}
                              download={Boolean(cvUrl)}
                              onClick={(event) => {
                                if (!cvUrl) event.preventDefault();
                              }}
                              className={`${
                                active ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                              } block px-4 py-3 text-base sm:text-lg text-gray-700 dark:text-gray-200 text-center sm:text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
                            >
                              Download CV
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href={portfolioUrl ?? '#'}
                              download={Boolean(portfolioUrl)}
                              onClick={(event) => {
                                if (!portfolioUrl) event.preventDefault();
                              }}
                              className={`${
                                active ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                              } block px-4 py-3 text-base sm:text-lg text-gray-700 dark:text-gray-200 text-center sm:text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
                            >
                              Download Portfolio
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <button
                  onClick={() =>
                    document
                      .getElementById('contact')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-base sm:text-lg md:text-xl font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap min-w-[160px] sm:min-w-[180px] md:min-w-[200px] text-center"
                >
                  Hubungi Saya
                </button>
              </div>

              {/* <div className="grid grid-cols-3 gap-4 pt-6 text-center sm:text-left">
                {statsConfig.map(({ key, label }) => (
                  <div
                    key={key}
                    className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1 dark:bg-white/10"
                  >
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {stats?.[key] ?? 0}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {label}
                    </div>
                  </div>
                ))}
              </div> */}
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center md:justify-end mb-8 md:mb-0">
            <div className="relative w-48 h-56 sm:w-56 sm:h-64 md:w-64 md:h-72 lg:w-72 lg:h-80 xl:w-80 xl:h-96 group">
              <div className="absolute -inset-2 rounded-[60%] bg-indigo-500/40 blur-[3px] transition duration-500 group-hover:bg-indigo-500/50" />
              <div className="absolute -inset-1.5 rounded-[60%] bg-indigo-600/90 ring-1 ring-indigo-400/50 transition duration-500 group-hover:bg-indigo-600 dark:ring-indigo-600/50" />
              <div className="relative h-full w-full overflow-hidden rounded-[60%] bg-gradient-to-b from-gray-100 to-gray-200 transition duration-500 group-hover:scale-[0.98] dark:from-gray-800 dark:to-gray-900">
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-105 animate-fadeIn"
                />
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="h-full w-full bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
