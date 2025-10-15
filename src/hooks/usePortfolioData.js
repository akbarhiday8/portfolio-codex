import { useEffect, useState } from 'react';

const baseURL = import.meta.env.VITE_PUBLIC_API_URL ?? 'http://localhost:8000/api/public';

export function usePortfolioData() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [tools, setTools] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, skillsRes, toolsRes, projectsRes, statsRes] = await Promise.all([
          fetch(`${baseURL}/profile`).then((res) => res.json()),
          fetch(`${baseURL}/skills`).then((res) => res.json()),
          fetch(`${baseURL}/tools`).then((res) => res.json()),
          fetch(`${baseURL}/projects`).then((res) => res.json()),
          fetch(`${baseURL}/stats`).then((res) => res.json()),
        ]);

        if (!ignore) {
          setProfile(profileRes?.data ?? profileRes ?? null);
          setSkills(skillsRes?.data ?? skillsRes ?? []);
          setTools(toolsRes?.data ?? toolsRes ?? []);
          setProjects(projectsRes?.data ?? projectsRes ?? []);
          setStats(statsRes ?? null);
        }
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      ignore = true;
    };
  }, []);

  return { profile, skills, tools, projects, stats, loading, error };
}
