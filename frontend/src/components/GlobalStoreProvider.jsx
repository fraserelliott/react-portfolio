import { createContext, useContext, useState, useEffect } from 'react';

const GlobalStoreContext = createContext(null);

export function GlobalStoreProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [authorised, setAuthorised] = useState(false);
  const [projects, setProjects] = useState([]);

  // Save page to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem('page', currentPage);
  }, [currentPage]);

  const value = {
    currentPageState: [currentPage, setCurrentPage],
    authorisedState: [authorised, setAuthorised],
    projects: [projects, setProjects],
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
    default:
      throw new Error(`Unknown global store key: ${key}`);
  }
}
