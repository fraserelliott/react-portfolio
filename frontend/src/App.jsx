import { useEffect } from 'react';
import { useGlobalStore } from './components/GlobalStoreProvider';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [currentPage, setCurrentPage] = useGlobalStore('currentPage');
  return (
    <Layout>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'projects' && <ProjectsPage />}
      {currentPage === 'dashboard' && <DashboardPage />}
    </Layout>
  );
}

export default App;
