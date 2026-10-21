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
  fetchBetterAuthSession,
  hasOrganizerAccess,
  signOutBetterAuth,
} from './session';

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
  authUrl?: string;
}

export function AuthProvider({
  children,
  initialUser = null,
  authUrl = 'http://localhost:3000',
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);

  useEffect(() => {
    if (initialUser) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    fetchBetterAuthSession(authUrl)
      .then(sessionUser => {
        if (!cancelled) {
          setUser(hasOrganizerAccess(sessionUser) ? sessionUser : null);
        }
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
  }, [initialUser, authUrl]);

  const login = (userData: AuthUser) => {
    setUser(userData);
  };

  const logout = async () => {
    await signOutBetterAuth(authUrl);
    setUser(null);
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
    [user, isLoading, authUrl]
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
