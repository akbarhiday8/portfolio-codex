import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const MIN_SWIPE_DISTANCE = 50;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

const resolveImages = (project) => {
  if (project?.images?.length) {
    return project.images
      .map((image) => (typeof image === 'string' ? image : image?.url))
      .filter(Boolean);
  }
  if (project?.cover_url) return [project.cover_url];
  if (project?.image_url) return [project.image_url];
  return [];
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const ProjectModal = ({ project, isOpen, onClose }) => {
  const images = useMemo(() => resolveImages(project), [project]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [slideDirection, setSlideDirection] = useState('');
  const [preloadedImages, setPreloadedImages] = useState({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [previewOffset, setPreviewOffset] = useState({ x: 0, y: 0 });
  const panRef = useRef({
    dragging: false,
    start: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  });

  const tools = project?.tools ?? [];
  const projectLink = project?.link_url ?? project?.link;
  const currentImage = images[currentImageIndex];
  const isCurrentImageReady = currentImage ? preloadedImages[currentImage] : true;

  const resetPreviewState = useCallback(() => {
    setPreviewZoom(1);
    setPreviewOffset({ x: 0, y: 0 });
    panRef.current.dragging = false;
    panRef.current.start = { x: 0, y: 0 };
    panRef.current.offset = { x: 0, y: 0 };
  }, []);

  const openPreview = useCallback(() => {
    if (!currentImage) return;
    resetPreviewState();
    setIsPreviewOpen(true);
  }, [currentImage, resetPreviewState]);

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    resetPreviewState();
  }, [resetPreviewState]);

  const handleZoomChange = useCallback((delta) => {
    setPreviewZoom((prev) => clamp(prev + delta, MIN_ZOOM, MAX_ZOOM));
  }, []);

  const handleZoomTo = useCallback((value) => {
    setPreviewZoom(clamp(value, MIN_ZOOM, MAX_ZOOM));
  }, []);

  const handleWheelZoom = useCallback((event) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.15 : 0.15;
    setPreviewZoom((prev) => clamp(prev + delta, MIN_ZOOM, MAX_ZOOM));
  }, []);

  const beginPan = useCallback((clientX, clientY) => {
    panRef.current.dragging = true;
    panRef.current.start = { x: clientX, y: clientY };
  }, []);

  const updatePan = useCallback((clientX, clientY) => {
    if (!panRef.current.dragging) return;
    const dx = clientX - panRef.current.start.x;
    const dy = clientY - panRef.current.start.y;
    panRef.current.start = { x: clientX, y: clientY };
    panRef.current.offset = {
      x: panRef.current.offset.x + dx,
      y: panRef.current.offset.y + dy,
    };
    setPreviewOffset({ ...panRef.current.offset });
  }, []);

  const endPan = useCallback(() => {
    if (!panRef.current.dragging) return;
    panRef.current.dragging = false;
  }, []);

  const handlePreviewMouseDown = useCallback(
    (event) => {
      event.preventDefault();
      beginPan(event.clientX, event.clientY);
    },
    [beginPan],
  );

  const handlePreviewMouseMove = useCallback(
    (event) => {
      if (!panRef.current.dragging) return;
      event.preventDefault();
      updatePan(event.clientX, event.clientY);
    },
    [updatePan],
  );

  const handlePreviewMouseUp = useCallback(() => {
    endPan();
  }, [endPan]);

  const handlePreviewTouchStart = useCallback(
    (event) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      beginPan(touch.clientX, touch.clientY);
    },
    [beginPan],
  );

  const handlePreviewTouchMove = useCallback(
    (event) => {
      if (!panRef.current.dragging || event.touches.length !== 1) return;
      const touch = event.touches[0];
      event.preventDefault();
      updatePan(touch.clientX, touch.clientY);
    },
    [updatePan],
  );

  const handlePreviewTouchEnd = useCallback(() => {
    endPan();
  }, [endPan]);

  const handleMainImageClick = useCallback(() => {
    if (currentImage) {
      openPreview();
    }
  }, [currentImage, openPreview]);

  const nextImage = useCallback(() => {
    if (!images.length) return;
    setSlideDirection('left');
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (!images.length) return;
    setSlideDirection('right');
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        if (isPreviewOpen) {
          event.preventDefault();
          closePreview();
          return;
        }
        onClose?.();
      }
      if (!isPreviewOpen && event.key === 'ArrowLeft') prevImage();
      if (!isPreviewOpen && event.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closePreview, isOpen, isPreviewOpen, nextImage, onClose, prevImage]);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setSlideDirection('');
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, project]);

  useEffect(() => {
    if (!isOpen && isPreviewOpen) {
      setIsPreviewOpen(false);
      resetPreviewState();
    }
  }, [isOpen, isPreviewOpen, resetPreviewState]);

  useEffect(() => {
    setIsPreviewOpen(false);
    resetPreviewState();
  }, [project, resetPreviewState]);

  useEffect(() => {
    if (isPreviewOpen) {
      resetPreviewState();
    }
  }, [currentImageIndex, isPreviewOpen, resetPreviewState]);

  useEffect(() => {
    setPreloadedImages({});
    if (!images.length) return;
    const unique = Array.from(new Set(images));
    unique.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setPreloadedImages((prev) => ({ ...prev, [src]: true }));
      };
    });
  }, [images]);

  useEffect(() => {
    const timer = setTimeout(() => setSlideDirection(''), 320);
    return () => clearTimeout(timer);
  }, [currentImageIndex]);

  useEffect(() => {
    panRef.current.offset = { ...previewOffset };
  }, [previewOffset]);

  const onTouchStart = (event) => {
    setTouchEnd(null);
    setTouchStart(event.touches[0].clientX);
  };

  const onTouchMove = (event) => {
    setTouchEnd(event.touches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (distance > MIN_SWIPE_DISTANCE) nextImage();
    if (distance < -MIN_SWIPE_DISTANCE) prevImage();
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <AnimatePresence>
      {isOpen && project ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />
          <div className="relative flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative z-10 w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800"
              onClick={(event) => event.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute -top-12 right-0 rounded-full bg-gray-900/60 p-2 text-white backdrop-blur-sm md:-top-12"
                aria-label="Tutup modal"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              <div className="space-y-5 p-5 md:space-y-6 md:p-8">
                <div
                  className="group relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900"
                  onClick={handleMainImageClick}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  {currentImage ? (
                    <>
                      {!isCurrentImageReady && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/10 backdrop-blur-[2px]">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                        </div>
                      )}
                      <div className="relative h-full w-full">
                        <AnimatePresence initial={false} mode="wait">
                          <motion.img
                            key={currentImageIndex}
                            src={currentImage}
                            alt={`${project.name ?? project.title ?? 'Project'} - ${currentImageIndex + 1}`}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            initial={{
                              x: slideDirection === 'right' ? -100 : slideDirection === 'left' ? 100 : 0,
                              opacity: 0,
                            }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{
                              x: slideDirection === 'right' ? 100 : slideDirection === 'left' ? -100 : 0,
                              opacity: 0,
                            }}
                            transition={{
                              x: { type: 'spring', stiffness: 300, damping: 30 },
                              opacity: { duration: 0.2 },
                            }}
                          />
                        </AnimatePresence>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-300">
                      Tidak ada foto proyek
                    </div>
                  )}

                  {currentImage && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-black/50 via-transparent to-transparent px-3 pb-3 pt-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white shadow">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
                        </svg>
                        Klik untuk perbesar
                      </div>
                    </div>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                        aria-label="Foto sebelumnya"
                      >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                        aria-label="Foto berikutnya"
                      >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                      {images.map((src, index) => (
                        <button
                          key={src}
                          onClick={(event) => {
                            event.stopPropagation();
                            setSlideDirection(index > currentImageIndex ? 'left' : 'right');
                            setCurrentImageIndex(index);
                          }}
                          className={`h-2.5 w-2.5 rounded-full transition ${
                            index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                          }`}
                          aria-label={`Lihat gambar ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                        {project.name ?? project.title ?? 'Tanpa Judul'}
                      </h3>
                      {project.category?.name && (
                        <span className="inline-flex w-fit rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                          {project.category.name}
                        </span>
                      )}
                    </div>
                    {projectLink && (
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                      >
                        Lihat Proyek
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7m0 0v7m0-7L10 14" />
                        </svg>
                      </motion.a>
                    )}
                  </div>

                  {project.description && (
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {project.description}
                    </p>
                  )}

                  {project.features?.length ? (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Fitur Utama</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-gray-600 dark:text-gray-300">
                        {project.features.map((feature, index) => (
                          <li key={`${feature}-${index}`}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {tools.length ? (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Teknologi</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tools.map((tool) => (
                          <motion.span
                            key={tool.id ?? tool.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                          >
                            {tool.name}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              </div>
              <AnimatePresence>
                {isPreviewOpen && currentImage ? (
                  <motion.div
                    key="project-image-preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[60] flex flex-col bg-black/90 backdrop-blur-sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      closePreview();
                    }}
                  >
                    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-6">
                      <div
                        className="absolute right-6 top-6 flex items-center gap-3"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          onClick={() => handleZoomChange(0.25)}
                          className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
                          aria-label="Perbesar"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleZoomChange(-0.25)}
                          className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
                          aria-label="Perkecil"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            closePreview();
                          }}
                          className="rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
                          aria-label="Tutup pratinjau"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div
                        className="relative flex max-h-full w-full max-w-6xl items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-black/30"
                        onClick={(event) => event.stopPropagation()}
                        onWheel={handleWheelZoom}
                        onMouseDown={handlePreviewMouseDown}
                        onMouseMove={handlePreviewMouseMove}
                        onMouseUp={handlePreviewMouseUp}
                        onMouseLeave={handlePreviewMouseUp}
                        onTouchStart={handlePreviewTouchStart}
                        onTouchMove={handlePreviewTouchMove}
                        onTouchEnd={handlePreviewTouchEnd}
                        role="presentation"
                      >
                        <img
                          src={currentImage}
                          alt={`${project.name ?? project.title ?? 'Project'} - preview`}
                          className="pointer-events-none select-none object-contain"
                          draggable={false}
                          style={{
                            transform: `translate3d(${previewOffset.x}px, ${previewOffset.y}px, 0) scale(${previewZoom})`,
                            transformOrigin: 'center center',
                            transition: panRef.current.dragging ? 'none' : 'transform 0.15s ease-out',
                            maxHeight: '100%',
                            maxWidth: '100%',
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className="flex flex-col items-center gap-3 pb-6 text-white"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleZoomTo(1)}
                          className="rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold transition hover:bg-white/30"
                        >
                          Reset
                        </button>
                        <span className="text-sm font-medium">{Math.round(previewZoom * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={MIN_ZOOM}
                        max={MAX_ZOOM}
                        step={0.1}
                        value={previewZoom}
                        onChange={(event) => handleZoomTo(Number(event.target.value))}
                        className="h-1 w-64 cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
                      />
                      <p className="text-xs text-white/70">
                        Geser untuk pan, gulir atau gunakan tombol untuk zoom.
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default ProjectModal;
