import { useEffect } from 'react';
import { useGlobalStore } from './components/GlobalStoreProvider';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  const [currentPage, setCurrentPage] = useGlobalStore('currentPage');

  useEffect(() => {
    // Load saved page from sessionStorage on mount
    const savedPage = sessionStorage.getItem('page');
    if (savedPage) {
      setCurrentPage(savedPage);
    }
  }, []);

  return (
    <Layout>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'projects' && <ProjectsPage />}
    </Layout>
  );
}

export default App;
