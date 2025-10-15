import React from 'react';

const joinClassNames = (...values) =>
  values
    .flat()
    .filter(Boolean)
    .join(' ');

/**
 * Reusable section wrapper to keep spacing, padding, and max-width consistent.
 */
const Section = ({
  id,
  background = 'bg-white dark:bg-gray-800',
  spacing = 'py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32',
  className,
  innerClassName,
  children,
}) => (
  <section id={id} className={joinClassNames(background, spacing, className)}>
    <div className={joinClassNames('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', innerClassName)}>
      {children}
    </div>
  </section>
);

export default Section;
