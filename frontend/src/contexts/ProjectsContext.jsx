import {createContext, useState, useEffect, useContext} from 'react';
import api from '../api';

export const ProjectsContext = createContext();

export function ProjectsProvider({children}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/posts")
      .then((res) => setProjects(res.data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProjectsContext.Provider value={{projects, loading, error}}>
      {children}
    </ProjectsContext.Provider>
  )
}

export const useProjects = () => useContext(ProjectsContext);