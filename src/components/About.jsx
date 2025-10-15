import React from 'react';
import Section from './Section';

const About = ({ profile, skills }) => {
  const aboutText = profile?.about ?? '';

  return (
    <Section id="about">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl dark:text-white">
          Tentang Saya
        </h2>
        <p className="mt-4 text-lg text-gray-500 sm:text-xl dark:text-gray-300">
          Mengenal lebih dekat perjalanan, tujuan, dan kemampuan yang saya bawa.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-gray-100 bg-gray-50/80 p-6 shadow-lg backdrop-blur-sm transition hover:shadow-xl dark:border-gray-700 dark:bg-gray-700/50 sm:mt-12 sm:p-10 md:rounded-3xl md:p-12">
        <p className="text-left text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl dark:text-gray-300">
          {aboutText}
        </p>

        <div className="mt-10 sm:mt-12 md:mt-14">
          <h3 className="text-left text-2xl font-semibold text-gray-800 sm:text-3xl dark:text-white">
            Keahlian
          </h3>
          <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
            {skills?.length ? (
              skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-xl bg-white/80 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:bg-gray-600/80 dark:text-gray-100 dark:hover:bg-gray-500 sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3 md:text-lg"
                >
                  {skill.name}
                  {skill.level ? (
                    <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-300 sm:text-sm">
                      {skill.level}%
                    </span>
                  ) : null}
                </span>
              ))
            ) : (
              <span className="rounded-xl bg-white px-5 py-2.5 text-base font-medium text-gray-500 shadow-sm dark:bg-gray-600 dark:text-gray-300">
                Data skill belum tersedia.
              </span>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;
