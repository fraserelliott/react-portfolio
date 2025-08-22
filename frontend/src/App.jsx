import {useGlobalStore, useToast} from './components/GlobalStoreProvider';
import {useEffect} from 'react';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectPage from './pages/ProjectPage';
import DashboardPage from './pages/DashboardPage';
import PageNotFound from './pages/PageNotFound';
import ToastMessageDisplay from './components/ToastMessageDisplay';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import api from './api.jsx';
import Header from './components/Header';
import Footer from "./components/Footer";
import OpenSourceBadge from "./components/OpenSourceBadge";

function App() {
  const [loginData, setLoginData] = useGlobalStore('loginData');
  const [tags, setTags] = useGlobalStore('tags');
  const {addToastMessage} = useToast();

  // Load data from API and session storage on mount
  useEffect(() => {
    loadTags();

    const loginData = sessionStorage.getItem('loginData');
    if (loginData) setLoginData(JSON.parse(loginData));
  }, []);

  const loadTags = async () => {
    try {
      const res = await api.get('/api/tags');
      setTags(res.data);
    } catch (err) {
      addToastMessage(err.message || 'Failed to load tags.', 'error');
    }
  };

  return (
    <>
      <BrowserRouter>
        <Header/>
        <OpenSourceBadge/>

        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/projects" element={<ProjectsPage/>}/>
          <Route path="/project" element={<ProjectPage/>}/>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>

        <Footer/>
      </BrowserRouter>
      <div style={{position: 'fixed', bottom: '3rem', right: '1rem'}}>
        <ToastMessageDisplay/>
      </div>

    </>
  );
}

export default App;
