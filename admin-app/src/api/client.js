import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const tokenKey = 'admin_token';
const preferredStorage =
  (import.meta.env.VITE_AUTH_STORAGE ?? 'session').toLowerCase() === 'local'
    ? 'local'
    : 'session';

const getStorage = (type) => {
  if (typeof window === 'undefined') return null;
  try {
    return type === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

const preferredStore = () => getStorage(preferredStorage);
const allStores = () => {
  if (typeof window === 'undefined') return [];
  const stores = [];
  const session = getStorage('session');
  const local = getStorage('local');
  if (session) stores.push(session);
  if (local && local !== session) stores.push(local);
  return stores;
};

export const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    const storage = preferredStore();
    if (storage) {
      storage.setItem(tokenKey, token);
      allStores()
        .filter((store) => store !== storage)
        .forEach((store) => store.removeItem(tokenKey));
    }
  } else {
    delete api.defaults.headers.common.Authorization;
    allStores().forEach((store) => store.removeItem(tokenKey));
  }
}

export function loadStoredToken() {
  const storageCandidates = allStores();
  for (const storage of storageCandidates) {
    const token = storage.getItem(tokenKey);
    if (token) {
      setAuthToken(token);
      return token;
    }
  }
  return null;
}
