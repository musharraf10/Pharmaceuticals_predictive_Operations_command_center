import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "../services/auth.service";
import { storage } from "../utils/storage";

const AuthContext = createContext(null);

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser());
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    storage.setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    storage.clearUser();
  }, []);

  const bootstrapSession = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      persistUser(response.data);
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession, persistUser]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    bootstrapSession();
  }, [bootstrapSession]);

  const login = useCallback(
    async (credentials) => {
      const response = await loginRequest(credentials);
      persistUser(response.data);
      toast.success(response.message || "Login successful");
      return response;
    },
    [persistUser],
  );

  const logout = useCallback(async () => {
    try {
      const response = await logoutRequest();
      toast.success(response.message || "Logged out successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Logout failed"));
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      setUser: persistUser,
      refreshUser: bootstrapSession,
    }),
    [bootstrapSession, loading, login, logout, persistUser, user],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
