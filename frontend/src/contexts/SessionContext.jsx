import {
  createContext, useContext, useEffect, useState,
  useCallback, useMemo
} from "react";
import {useApi} from "./ApiContext.jsx";
import api from "../api"; // ensure this path is correct

export const SessionContext = createContext({
  token: null,
  loginAsync: async () => null,
  logout: () => {
  },
});

export function SessionProvider({children}) {
  const {runApi} = useApi();
  const [token, setToken] = useState(() => sessionStorage.getItem("authToken"));

  // TODO: validate token after retrieving

  // Persist token to sessionStorage
  useEffect(() => {
    if (token) sessionStorage.setItem("authToken", token);
    else sessionStorage.removeItem("authToken");
  }, [token]);

  const loginAsync = useCallback(async (email, password) => {
    return runApi(
      api.post("/api/auth", {email, password}),
      (updated) => setToken(updated.token),
      "Error logging in"
    );
  }, [runApi]);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  const value = useMemo(() => ({
    token,
    loginAsync,
    logout,
  }), [token, loginAsync, logout]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);