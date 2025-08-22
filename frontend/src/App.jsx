import './App.css';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectPage from './pages/ProjectPage';
import DashboardPage from './pages/DashboardPage';
import PageNotFound from './pages/PageNotFound';
import ToastMessageDisplay from './components/ToastMessageDisplay';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from './components/Header';
import Footer from "./components/Footer";
import OpenSourceBadge from "./components/OpenSourceBadge";

function App() {
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
