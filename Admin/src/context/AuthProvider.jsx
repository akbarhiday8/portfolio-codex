import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, loadStoredToken, setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const token = loadStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/profile');
        const profileData = data?.data?.[0] ?? null;
        setProfile(profileData);
        if (profileData) {
          setUser({
            name: profileData?.name ?? 'Admin',
          });
        }
      } catch {
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);

      if (data.token || data.access_token) {
        setAuthToken(data.token ?? data.access_token);
      }

      setUser(data.user);
      setProfile(data.profile?.data ?? data.profile ?? null);
      return data.user;
    } catch (error) {
      setAuthToken(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore network errors on logout
    } finally {
      setAuthToken(null);
      setUser(null);
      setProfile(null);
    }
  };

  const value = useMemo(
    () => ({ user, profile, setProfile, login, logout, loading }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
