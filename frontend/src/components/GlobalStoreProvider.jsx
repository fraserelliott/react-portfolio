import { createContext, useContext, useState, useEffect } from 'react';

const GlobalStoreContext = createContext(null);

export function GlobalStoreProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [authorised, setAuthorised] = useState(false);

  // Save page to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem('page', currentPage);
  }, [currentPage]);

  const value = {
    currentPageState: [currentPage, setCurrentPage],
    authorisedState: [authorised, setAuthorised],
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
    default:
      throw new Error(`Unknown global store key: ${key}`);
  }
}
