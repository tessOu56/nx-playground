import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  type AuthUser,
  createKratosLogoutUrl,
  fetchKratosSession,
} from './kratos-session';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: AuthUser | null;
  kratosPublicUrl?: string;
}

export function AuthProvider({
  children,
  initialUser = null,
  kratosPublicUrl = 'http://localhost:4433',
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);

  useEffect(() => {
    if (initialUser) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    fetchKratosSession(kratosPublicUrl)
      .then(sessionUser => {
        if (!cancelled) setUser(sessionUser);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialUser, kratosPublicUrl]);

  const login = (userData: AuthUser) => {
    setUser(userData);
  };

  const logout = async () => {
    const logoutUrl = await createKratosLogoutUrl(kratosPublicUrl);
    setUser(null);
    if (logoutUrl) {
      window.location.href = logoutUrl;
    }
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    setUser(current => (current ? { ...current, ...userData } : current));
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
