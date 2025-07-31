import { useEffect } from 'react';
import { useGlobalStore } from './components/GlobalStoreProvider';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

function App() {
  const [currentPage, setCurrentPage] = useGlobalStore('currentPage');

  // Load saved page from sessionStorage on mount
  useEffect(() => {
    const savedPage = sessionStorage.getItem('page');
    if (savedPage) {
      setCurrentPage(savedPage);
    }
  }, []);

  return <Layout>{currentPage === 'home' && <HomePage />}</Layout>;
}

export default App;
