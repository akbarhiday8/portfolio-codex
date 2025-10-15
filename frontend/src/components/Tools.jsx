import React, { useMemo, useState } from 'react';
import Section from './Section';

const Tools = ({ tools }) => {
  const [visibleTools, setVisibleTools] = useState(8);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = useMemo(() => {
    const unique = new Map();
    tools?.forEach((tool) => {
      if (tool.category) {
        unique.set(tool.category, tool.category);
      }
    });
    return [
      { id: 'all', name: 'Semua Tools' },
      ...Array.from(unique.values()).map((category) => ({
        id: category,
        name: category,
      })),
    ];
  }, [tools]);

  const filteredTools =
    activeCategory === 'all'
      ? tools
      : tools?.filter((tool) => tool.category === activeCategory);

  const list = filteredTools?.slice(0, visibleTools) ?? [];
  const hasMore = (filteredTools?.length ?? 0) > visibleTools;

  const resetScroll = () => {
    const section = document.getElementById('tools');
    if (!section) return;
    const target = section.offsetTop - 120;
    window.scrollTo({ top: target < 0 ? 0 : target, behavior: 'smooth' });
  };

  return (
    <Section id="tools" background="bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl dark:text-white">
          Tools yang Dipakai
        </h2>
        <p className="mt-4 text-lg text-gray-600 sm:text-xl dark:text-gray-300">
          Serangkaian aplikasi dan layanan yang mendukung proses kreatif serta produktivitas harian.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2.5 sm:mt-12 sm:gap-3 md:gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setVisibleTools(8);
              resetScroll();
            }}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow ${
              activeCategory === category.id
                ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
            } sm:px-5 sm:py-2.5 sm:text-base`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {list.map((tool) => (
          <article
            key={tool.id}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:gap-5 sm:p-6"
          >
            <div
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-lg font-semibold text-white shadow-inner sm:h-16 sm:w-16 sm:text-xl"
              style={{ backgroundColor: tool.icon_color ?? '#1f2937' }}
            >
              {tool.name.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-gray-800 dark:text-white sm:text-xl">
                {tool.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 sm:text-base">
                {tool.type ?? 'Tool'}
              </p>
              <p className="mt-0.5 text-xs uppercase text-gray-500 dark:text-gray-400 sm:text-sm">
                {tool.category}
              </p>
            </div>
          </article>
        ))}

        {!list.length && (
          <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white/80 p-8 text-center text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-300">
            Belum ada data tools.
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-center sm:mt-12">
        {hasMore ? (
          <button
            onClick={() => setVisibleTools((prev) => prev + 8)}
            className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg dark:bg-indigo-500 dark:hover:bg-indigo-600 sm:px-8 sm:py-3 sm:text-base"
          >
            Lihat Lebih Banyak
          </button>
        ) : visibleTools > 8 ? (
          <button
            onClick={() => {
              setVisibleTools(8);
              resetScroll();
            }}
            className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-8 sm:py-3 sm:text-base"
          >
            Lihat Lebih Sedikit
          </button>
        ) : null}
      </div>
    </Section>
  );
};

export default Tools;
