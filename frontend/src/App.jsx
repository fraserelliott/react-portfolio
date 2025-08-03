import { useGlobalStore } from './components/GlobalStoreProvider';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import DashboardPage from './pages/DashboardPage';
import ToastMessageDisplay from './components/ToastMessageDisplay';

function App() {
  const [currentPage, setCurrentPage] = useGlobalStore('currentPage');
  return (
    <>
      <Layout>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'projects' && <ProjectsPage />}
        {currentPage === 'dashboard' && <DashboardPage />}
      </Layout>
      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}>
        <ToastMessageDisplay />
      </div>
    </>
  );
}

export default App;
