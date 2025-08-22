import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {GlobalStoreProvider} from './components/GlobalStoreProvider.jsx';
import {ProjectsProvider} from './contexts/ProjectsContext.jsx';

createRoot(document.getElementById('root')).render(<GlobalStoreProvider>
  <ProjectsProvider>
    <App/>
  </ProjectsProvider>
</GlobalStoreProvider>);
