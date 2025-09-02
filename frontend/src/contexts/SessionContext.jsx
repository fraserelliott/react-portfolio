import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useApi } from './ApiContext.jsx';
import api from '../api'; // ensure this path is correct

export const SessionContext = createContext({
  token: null,
  loginAsync: async () => null,
  logout: () => {},
});

export function SessionProvider({ children }) {
  const { runApi, registerUnauthorisedHandler } = useApi();
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));

  // TODO: validate token after retrieving

  // Persist token to localStorage
  useEffect(() => {
    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');
  }, [token]);

  const loginAsync = useCallback(
    async (email, password) => {
      return runApi(
        api.post('/api/users/login', { email, password }),
        (data) => setToken(data.token),
        'Error logging in',
      );
    },
    [runApi],
  );

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  useEffect(() => {
    registerUnauthorisedHandler(() => {
      // Only do work if we actually had a token
      setToken((prev) => (prev ? null : prev));
    });
  }, [registerUnauthorisedHandler]);

  const value = useMemo(
    () => ({
      token,
      loginAsync,
      logout,
    }),
    [token, loginAsync, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
