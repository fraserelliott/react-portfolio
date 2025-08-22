import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {ProjectsProvider} from './contexts/ProjectsContext.jsx';
import {ApiProvider} from './contexts/ApiContext.jsx';
import {ToastProvider} from './contexts/ToastContext.jsx';
import {SessionProvider} from './contexts/SessionContext.jsx';

createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <ApiProvider>
      <SessionProvider>
        <ProjectsProvider>
          <App/>
        </ProjectsProvider>
      </SessionProvider>
    </ApiProvider>
  </ToastProvider>
);