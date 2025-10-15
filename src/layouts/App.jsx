import React from 'react'
import {
  Navbar,
  Hero,
  About,
  Tools,
  Projects,
  Contact,
  Footer,
  DarkModeToggle
} from '../components'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { usePortfolioData } from '../hooks/usePortfolioData'

const App = () => {
  useScrollAnimation();
  const { profile, skills, tools, projects, stats, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200">
        Memuat konten portfolio...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-semibold">Gagal memuat data</h2>
          <p className="text-sm opacity-80">Silakan refresh halaman untuk mencoba lagi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-poppins min-h-screen flex flex-col dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Hero profile={profile} stats={stats} />
        <About profile={profile} skills={skills} />
        <Tools tools={tools} />
        <Projects projects={projects} />
        <Contact />
      </main>
      <Footer />
      <DarkModeToggle />
    </div>
  )
}

export default App 
