import { useState, useEffect } from 'react';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

function App() {
  const [page, setPage] = useState('home');

  // Load saved page from sessionStorage on mount
  useEffect(() => {
    const savedPage = sessionStorage.getItem('page');
    if (savedPage) {
      setPage(savedPage);
    }
  }, []);

  // Save page to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem('page', page);
  }, [page]);

  return (
    <Layout selectedPage={page} onSetPage={setPage}>
      {page === 'home' && <HomePage />}
    </Layout>
  );
}

export default App;
