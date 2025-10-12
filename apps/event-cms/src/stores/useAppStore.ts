import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
}

interface AppState {
  sidebarCollapsed: boolean;
  currentPage: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  notifications: Notification[];
  theme: 'light' | 'dark';
}

interface AppActions {
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;
  setBreadcrumbs: (
    breadcrumbs: Array<{ label: string; href?: string }>
  ) => void;
  addNotification: (
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // State
      sidebarCollapsed: false,
      currentPage: 'Dashboard',
      breadcrumbs: [{ label: 'Dashboard' }],
      notifications: [],
      theme: 'light',

      // Actions
      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      toggleSidebar: () => {
        set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setCurrentPage: (page: string) => {
        set({ currentPage: page });
      },

      setBreadcrumbs: (
        breadcrumbs: Array<{ label: string; href?: string }>
      ) => {
        set({ breadcrumbs });
      },

      addNotification: notification => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = {
          ...notification,
          id,
          timestamp: new Date(),
        };

        set(state => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove after 5 seconds for non-error notifications
        if (notification.type !== 'error') {
          setTimeout(() => {
            get().removeNotification(id);
          }, 5000);
        }
      },

      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
    }),
    { name: 'AppStore' }
  )
);
