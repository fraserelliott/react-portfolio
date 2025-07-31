import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GlobalStoreProvider } from './components/GlobalStoreProvider.jsx';

createRoot(document.getElementById('root')).render(
  <GlobalStoreProvider>
    <App />
  </GlobalStoreProvider>
);
