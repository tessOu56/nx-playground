import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedQuestions?: string[];
}

export interface ConversationSession {
  sessionId: string;
  timestamp: Date;
  messages: Message[];
}

interface SearchState {
  hasSearchHistory: boolean;
  currentQuery: string;
  conversationSessions: ConversationSession[];
  currentSessionId: string | null;
  
  // Legacy actions
  setHasSearchHistory: (has: boolean) => void;
  setCurrentQuery: (query: string) => void;
  
  // Conversation actions
  addMessage: (message: Message) => void;
  createNewSession: () => string;
  clearCurrentSession: () => void;
  restoreSession: (sessionId: string) => void;
  getCurrentSession: () => ConversationSession | null;
  deleteSession: (sessionId: string) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      hasSearchHistory: false,
      currentQuery: '',
      conversationSessions: [],
      currentSessionId: null,
      
      setHasSearchHistory: has => set({ hasSearchHistory: has }),
      setCurrentQuery: query => set({ currentQuery: query }),
      
      addMessage: message => {
        const state = get();
        let sessionId = state.currentSessionId;
        
        // Create new session if none exists
        if (!sessionId) {
          sessionId = `session-${Date.now()}`;
          set({
            currentSessionId: sessionId,
            conversationSessions: [
              ...state.conversationSessions,
              {
                sessionId,
                timestamp: new Date(),
                messages: [message],
              },
            ],
            hasSearchHistory: true,
          });
        } else {
          // Add to existing session
          set({
            conversationSessions: state.conversationSessions.map(session =>
              session.sessionId === sessionId
                ? { ...session, messages: [...session.messages, message] }
                : session
            ),
            hasSearchHistory: true,
          });
        }
      },
      
      createNewSession: () => {
        const sessionId = `session-${Date.now()}`;
        set({ currentSessionId: sessionId });
        return sessionId;
      },
      
      clearCurrentSession: () => {
        set({ currentSessionId: null });
      },
      
      restoreSession: sessionId => {
        set({ currentSessionId: sessionId });
      },
      
      getCurrentSession: () => {
        const state = get();
        if (!state.currentSessionId) return null;
        return (
          state.conversationSessions.find(
            s => s.sessionId === state.currentSessionId
          ) || null
        );
      },
      
      deleteSession: sessionId => {
        const state = get();
        set({
          conversationSessions: state.conversationSessions.filter(
            s => s.sessionId !== sessionId
          ),
          currentSessionId:
            state.currentSessionId === sessionId ? null : state.currentSessionId,
        });
      },
    }),
    {
      name: 'search-storage',
    }
  )
);
