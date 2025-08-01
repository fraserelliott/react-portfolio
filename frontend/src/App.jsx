import { useEffect } from 'react';
import { useGlobalStore } from './components/GlobalStoreProvider';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

function App() {
  const [currentPage, setCurrentPage] = useGlobalStore('currentPage');
  const [projects, setProjects] = useGlobalStore('projects');

  useEffect(() => {
    // Load saved page from sessionStorage on mount
    const savedPage = sessionStorage.getItem('page');
    if (savedPage) {
      setCurrentPage(savedPage);
    }

    loadProjects();
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

  return <Layout>{currentPage === 'home' && <HomePage />}</Layout>;
}

export default App;
