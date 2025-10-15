import { useEffect } from 'react';

export const useScrollAnimation = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up', 'opacity-100');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    sections.forEach(section => {
      section.classList.add('opacity-0');
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);
}; 