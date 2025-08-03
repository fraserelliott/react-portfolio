import { useGlobalStore, useToast } from './components/GlobalStoreProvider';
import { useEffect } from 'react';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import DashboardPage from './pages/DashboardPage';
import ToastMessageDisplay from './components/ToastMessageDisplay';

function App() {
  const [currentPage, setCurrentPage] = useGlobalStore('currentPage');
  const [loginData, setLoginData] = useGlobalStore('loginData');
  const [projects, setProjects] = useGlobalStore('projects');
  const [tags, setTags] = useGlobalStore('tags');
  const { addToastMessage } = useToast();

  // Load data from API and session storage on mount
  useEffect(() => {
    loadProjects();
    loadTags();

    const savedPage = sessionStorage.getItem('page');
    if (savedPage) setCurrentPage(savedPage);

    const loginData = sessionStorage.getItem('loginData');
    if (loginData) setLoginData(JSON.parse(loginData));
  }, []);

  // Save page to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem('page', currentPage);
  }, [currentPage]);

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) {
        const { error} = await res.json();
        addToastMessage(errorMsg || 'Error loading projects.', 'error');
        return;
      }

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      addToastMessage(err.message || 'Failed to load projects.', 'error');
    }
  };

  const loadTags = async () => {
    try {
      const res = await fetch('/api/tags');
      if (!res.ok) {
        const { error} = await res.json();
        addToastMessage(errorMsg || 'Error loading tags.', 'error');
        return;
      }

      const data = await res.json();
      setTags(data);
    } catch (err) {
      addToastMessage(err.message || 'Failed to load tags.', 'error');
    }
  };

  return (
    <>
      <Layout>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'projects' && <ProjectsPage />}
        {currentPage === 'dashboard' && <DashboardPage />}
      </Layout>
      <div style={{ position: 'absolute', bottom: '3rem', right: '1rem' }}>
        <ToastMessageDisplay />
      </div>
    </>
  );
}

export default App;
