import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useProjects } from '../contexts/ProjectsContext.jsx';
import Project from '../components/Project.jsx';

const ProjectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, loading, error } = useProjects();

  // Parse query params
  const searchParams = new URLSearchParams(location.search);
  const id = parseInt(searchParams.get('id'), 10);
  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    if (!loading && (!id || !project)) navigate('/');
  }, [id, project, loading, navigate]);

  if (loading) return null;
  // TODO: error component
  if (error) return <h1>Error...</h1>;

  return <Project project={project} />;
};

export default ProjectPage;
