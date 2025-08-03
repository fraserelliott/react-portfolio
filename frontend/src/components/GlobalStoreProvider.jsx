import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

const GlobalStoreContext = createContext(null);

// Provider component that wraps the app and provides global state via context
export function GlobalStoreProvider({ children }) {
  // Define all global state pieces here and how the context accesses them
  const [currentPage, setCurrentPage] = useState('home');
  const [loginData, setLoginData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentProject, setCurrentProject] = useState();
  const [toastMessages, setToastMessages] = useState([]);

  const value = {
    currentPageState: [currentPage, setCurrentPage],
    loginDataState: [loginData, setLoginData],
    projectsState: [projects, setProjects],
    tagsState: [tags, setTags],
    currentProjectState: [currentProject, setCurrentProject],
    toastMessagesState: [toastMessages, setToastMessages],
  };

  // Load data from API and session storage on mount
  useEffect(() => {
    loadProjects();
    loadTags();

    const savedPage = sessionStorage.getItem('page');
    if (savedPage) setCurrentPage(savedPage);

    const loginData = sessionStorage.getItem('loginData');
    if (loginData) setLoginData(JSON.parse(loginData));
  }, []);

  const loadProjects = () => {
    fetch('http://127.0.0.1:3001/api/posts')
      .then((res) => {
        if (!res.ok) {
          // TODO: error message
          return Promise.reject();
        }
        return res.json();
      })
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => {
        // TODO: error message
        console.error(err);
      });
  };

  const loadTags = () => {
    fetch('http://127.0.0.1:3001/api/tags')
      .then((res) => {
        if (!res.ok) {
          // TODO: error message
          return Promise.reject();
        }
        return res.json();
      })
      .then((data) => {
        setTags(data);
      })
      .catch((err) => {
        // TODO: error message
        console.error(err);
      });
  };

  // Save page to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem('page', currentPage);
  }, [currentPage]);

  return (
    <GlobalStoreContext.Provider value={value}>
      {children}
    </GlobalStoreContext.Provider>
  );
}

/**
 * Custom hook to access and update global app state by key.
 *
 * Usage:
 *   const [value, setValue] = useGlobalStore('projects');
 *
 * Supported keys:
 * - 'currentPage'
 * - 'loginData'
 * - 'projects'
 * - 'tags'
 * - 'currentProject'
 *
 * Must be used within a <GlobalStoreProvider> context. If <App> is wrapped by <GlobalStoreProvider> (e.g., in main.jsx), then this hook will be available in any component within <App>.
 *
 * @param {string} key - The key identifying the piece of global state to access.
 * @returns {[any, Function]} The state value and setter function for the given key.
 * @throws Will throw an error if used outside GlobalStoreProvider or with an unknown key.
 */
export function useGlobalStore(key) {
  const context = useContext(GlobalStoreContext);
  if (!context) {
    throw new Error('useGlobalStore must be used within GlobalStoreProvider');
  }

  switch (key) {
    case 'currentPage':
      return context.currentPageState;
    case 'loginData':
      return context.loginDataState;
    case 'projects':
      return context.projectsState;
    case 'tags':
      return context.tagsState;
    case 'currentProject':
      return context.currentProjectState;
    case 'toastMessages':
      return context.toastMessagesState;
    default:
      throw new Error(`Unknown global store key: ${key}`);
  }
}

export function addToastMessage(message, delayMs = 1350, type = 'success') {
  const id = uuid();
  const newMessage = {
    id,
    message,
    delayMs,
    type,
    fading: false,
  };

  setToastMessages((prev) => [...prev, newMessage]);

  // Schedule fading and removal
  setTimeout(() => {
    setToastMessages((prev) =>
      prev.map((msg) => {
        msg.id === id ? { ...msg, fading: true } : msg;
      })
    );

    setTimeout(() => {
      setToastMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, 150);
  }, delayMs);
}
