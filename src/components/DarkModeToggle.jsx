import React, { useEffect, useMemo, useRef, useState } from 'react';

const computeFloatingPosition = () => {
  if (typeof window === 'undefined') {
    return { top: 'auto', left: 'auto', bottom: 80, right: 16 };
  }
  const width = window.innerWidth;
  if (width < 640) return { top: 'auto', left: 'auto', bottom: 88, right: 16 };
  if (width < 768) return { top: 'auto', left: 'auto', bottom: 104, right: 20 };
  if (width < 1024) return { top: 'auto', left: 'auto', bottom: 32, right: 24 };
  if (width < 1280) return { top: 'auto', left: 'auto', bottom: 32, right: 32 };
  return { top: 'auto', left: 'auto', bottom: 32, right: 48 };
};

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [isInFooter, setIsInFooter] = useState(false);
  const [position, setPosition] = useState(() => computeFloatingPosition());
  const [footerStyle, setFooterStyle] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1024 : window.innerWidth
  );
  const timeoutRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const currentSize = useMemo(() => {
    if (viewportWidth >= 1280) return 'lg';
    if (viewportWidth >= 1024) return 'md';
    if (viewportWidth >= 768) return 'sm';
    return 'xs';
  }, [viewportWidth]);

  const resetIdleTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (window.innerWidth < 768) {
      setIsVisible(true);
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const alignWithFooterIcons = () => {
      const toggleEl = toggleRef.current;
      if (!toggleEl) return false;

      const githubIcon = document.querySelector('footer [aria-label="GitHub"]');
      if (!githubIcon) return false;

      const iconRect = githubIcon.getBoundingClientRect();
      const iconVisible =
        iconRect.top < window.innerHeight && iconRect.bottom > 0;

      if (iconVisible) {
        const gap = 25;
        const targetIconSize = Math.max(iconRect.height, 20);
        const targetDiameter = Math.max(targetIconSize + 10, 32);
        const top = Math.max(
          iconRect.top + (iconRect.height - targetDiameter) / 2,
          0
        );
        const left = Math.max(iconRect.left - gap - targetDiameter, 12);

        setIsInFooter(true);
        setFooterStyle({
          targetDiameter,
          iconSize: targetIconSize,
        });
        setPosition((prev) => {
          if (
            prev.top === top &&
            prev.left === left &&
            prev.bottom === 'auto' &&
            prev.right === 'auto'
          ) {
            return prev;
          }
          return {
            top,
            left,
            bottom: 'auto',
            right: 'auto',
          };
        });
        return true;
      } else {
        setIsInFooter(false);
        setFooterStyle(null);
        setPosition((prev) => {
          const next = computeFloatingPosition();
          if (
            prev.top === next.top &&
            prev.left === next.left &&
            prev.bottom === next.bottom &&
            prev.right === next.right
          ) {
            return prev;
          }
          return next;
        });
        return false;
      }
    };

    const controlVisibility = () => {
      const currentScrollY = window.scrollY;
      resetIdleTimer();

      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const handleTouchStart = (event) => {
      setTouchStart(event.touches[0].clientY);
      resetIdleTimer();
    };

    const handleTouchMove = (event) => {
      resetIdleTimer();
      if (!touchStart) return;

      const currentTouch = event.touches[0].clientY;
      const diff = touchStart - currentTouch;

      if (diff > 50) {
        setIsVisible(false);
      } else if (diff < -50) {
        setIsVisible(true);
      }
    };

    const handleTouchEnd = () => {
      setTouchStart(null);
      resetIdleTimer();
    };

    const handleMouseMove = () => {
      resetIdleTimer();
    };

    const handleScroll = () => {
      alignWithFooterIcons();
      controlVisibility();
    };

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      const aligned = alignWithFooterIcons();
      if (!aligned) {
        setPosition((prev) => {
          const next = computeFloatingPosition();
          if (
            prev.top === next.top &&
            prev.left === next.left &&
            prev.bottom === next.bottom &&
            prev.right === next.right
          ) {
            return prev;
          }
          return next;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousemove', handleMouseMove);

    alignWithFooterIcons();
    controlVisibility();
    resetIdleTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isInFooter, lastScrollY, touchStart]);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
    resetIdleTimer();
  };

  const sizeMap = {
    xs: { padding: 12, icon: 20 },
    sm: { padding: 14, icon: 22 },
    md: { padding: 16, icon: 24 },
    lg: { padding: 18, icon: 26 },
  };

  const sizeToken = sizeMap[currentSize] ?? sizeMap.sm;

  const isMobile = viewportWidth < 768;
  const translateY = !isVisible && isMobile ? '120%' : '0px';
  const opacity = !isVisible && isMobile ? 0 : 1;
  const iconColorClass =
    isDark || isInFooter ? 'text-gray-700' : 'text-gray-200';
  const containerClasses = [
    'fixed z-50 group rounded-full border-2 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out motion-reduce:transition-none transform-gpu will-change-transform',
    isDark || isInFooter
      ? 'bg-white border-gray-300'
      : 'bg-gray-800 border-gray-700',
  ].join(' ');

  const basePadding = sizeToken.padding;
  const baseIconSize = sizeToken.icon;
  let iconSize = baseIconSize;
  let paddingValue = basePadding;

  if (isInFooter && footerStyle) {
    iconSize = Math.max(Math.min(footerStyle.iconSize, 36), 18);
    paddingValue = Math.max((footerStyle.targetDiameter - iconSize) / 2, 6);
  }

  return (
    <button
      ref={toggleRef}
      id="darkModeToggle"
      onClick={toggleDarkMode}
      className={containerClasses}
      style={{
        ...position,
        transformOrigin: 'center center',
        transform: `translate3d(0, ${translateY}, 0)`,
        opacity,
        pointerEvents: opacity === 0 ? 'none' : 'auto',
        padding: paddingValue,
      }}
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <svg
          className={`transform transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none ${iconColorClass}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ width: iconSize, height: iconSize }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className={`transform transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none ${iconColorClass}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ width: iconSize, height: iconSize }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};

export default DarkModeToggle;
