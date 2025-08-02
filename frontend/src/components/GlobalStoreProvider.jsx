import { createContext, useContext, useState, useEffect } from 'react';

const GlobalStoreContext = createContext(null);

export function GlobalStoreProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [authorised, setAuthorised] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentProject, setCurrentProject] = useState();

  // Load data on mount
  useEffect(() => {
    loadProjects();
    loadTags();
  }, []);

  // Save page to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem('page', currentPage);
  }, [currentPage]);

  const value = {
    currentPageState: [currentPage, setCurrentPage],
    authorisedState: [authorised, setAuthorised],
    projects: [projects, setProjects],
    tags: [tags, setTags],
    currentProject: [currentProject, setCurrentProject],
  };

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

  return (
    <GlobalStoreContext.Provider value={value}>
      {children}
    </GlobalStoreContext.Provider>
  );
}

// Hook to access any global state by key
export function useGlobalStore(key) {
  const context = useContext(GlobalStoreContext);
  if (!context) {
    throw new Error('useGlobalStore must be used within GlobalStoreProvider');
  }

  switch (key) {
    case 'currentPage':
      return context.currentPageState;
    case 'authorised':
      return context.authorisedState;
    case 'projects':
      return context.projects;
    case 'tags':
      return context.tags;
    case 'currentProject':
      return context.currentProject;
    default:
      throw new Error(`Unknown global store key: ${key}`);
  }
}
