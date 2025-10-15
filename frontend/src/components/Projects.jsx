import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectModal from './ProjectModal';
import Skeleton from './Skeleton';
import Section from './Section';

const slugify = (value) => {
  if (!value) return '';
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const getCategoryName = (project) => project?.category?.name?.trim() || 'Tanpa Kategori';
const getCategorySlug = (project) => project?.category?.slug || slugify(getCategoryName(project)) || 'tanpa-kategori';
const getPrimaryImage = (project) =>
  project?.images?.[0]?.url ?? project?.cover_url ?? 'https://placehold.co/800x450?text=Project';
const getTools = (project) => project?.tools ?? [];

export default function Projects({ projects }) {
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [activeCategory, setActiveCategory] = useState('semua');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [projects]);

  const categories = useMemo(() => {
    const map = new Map();
    projects?.forEach((project) => {
      const name = getCategoryName(project);
      const id = getCategorySlug(project);
      if (!map.has(id)) {
        map.set(id, { id, name });
      }
    });

    return [{ id: 'semua', name: 'Semua Proyek' }, ...Array.from(map.values())];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'semua') return projects ?? [];
    return (projects ?? []).filter((project) => getCategorySlug(project) === activeCategory);
  }, [activeCategory, projects]);

  const gridList = filteredProjects.slice(0, visibleProjects);
  const hasMore = filteredProjects.length > visibleProjects;

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setVisibleProjects(6);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 400);
  };

  const scrollToSection = useCallback(() => {
    const section = document.getElementById('projects');
    if (!section) return;
    const target = section.offsetTop - window.innerHeight / 4;
    window.scrollTo({ top: target < 0 ? 0 : target, behavior: 'smooth' });
  }, []);

  const handleLoadMore = () => {
    setVisibleProjects((prev) => prev + 6);
  };

  const handleLoadLess = () => {
    setVisibleProjects(6);
    scrollToSection();
  };

  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const cards = isLoading
    ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={`project-skeleton-${index}`} type="project" />)
    : gridList.map((project, index) => {
        const tools = getTools(project);
        return (
          <motion.div
            key={project.id ?? project.slug ?? project.name ?? project.title ?? index}
            layout
            whileHover={{ translateY: -12 }}
            className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-gray-50 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-700"
            onClick={() => openModal(project)}
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={getPrimaryImage(project)}
                alt={project.name ?? project.title ?? 'Project'}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm dark:bg-gray-900/80 dark:text-gray-100">
                {getCategoryName(project)}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <h3 className="text-xl font-semibold text-gray-800 transition-colors duration-300 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                {project.name ?? project.title ?? 'Tanpa Judul'}
              </h3>
              <p className="mt-3 flex-1 text-sm text-gray-600 dark:text-gray-300">
                {project.description ?? 'Deskripsi belum tersedia.'}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
                {tools.length ? (
                  tools.map((tool) => (
                    <span
                      key={tool.id ?? tool.name}
                      className="rounded-full bg-gray-200/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700 backdrop-blur-sm dark:bg-gray-600/70 dark:text-gray-200"
                    >
                      {tool.name}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-gray-200/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:bg-gray-600/60 dark:text-gray-300">
                    Teknologi belum diatur
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      });

  return (
    <Section id="projects" background="bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl dark:text-white">
          Proyek Terbaru
        </h2>
        <p className="mt-4 text-base text-gray-500 sm:text-lg dark:text-gray-300">
          Kumpulan proyek yang saya bangun beserta kategori dan teknologi yang digunakan.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2.5 sm:mt-12 sm:gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
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

      <AnimatePresence mode="wait">
        <motion.div
          key={isLoading ? 'loading' : `grid-${activeCategory}-${visibleProjects}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.3 }}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {cards}
        </motion.div>
      </AnimatePresence>

      {!isLoading && !gridList.length && (
        <div className="mt-10 rounded-2xl border border-dashed border-gray-200 bg-white/80 p-8 text-center text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-700/40 dark:text-gray-300">
          Belum ada proyek dalam kategori ini.
        </div>
      )}

      {!isLoading && (
        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          {hasMore && (
            <button
              onClick={handleLoadMore}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg dark:bg-indigo-500 dark:hover:bg-indigo-600 sm:px-8 sm:py-3 sm:text-base"
            >
              Tampilkan Lebih Banyak
            </button>
          )}
          {visibleProjects > 6 && (
            <button
              onClick={handleLoadLess}
              className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-8 sm:py-3 sm:text-base"
            >
              Tampilkan Lebih Sedikit
            </button>
          )}
        </div>
      )}

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Section>
  );
}
