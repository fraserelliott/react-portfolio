import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import {useGlobalStore} from '../components/GlobalStoreProvider.jsx';
import Project from '../components/Project.jsx';

const ProjectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [projects, setProjects] = useGlobalStore('projects');

  // Parse query params
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const project = projects.find((p) => p.id === id);
  console.log(project);

  useEffect(() => {
    if (!id || !project)
      navigate('/');
  }, [id, project, navigate])

  return (
    <>
      <Project project={project}/>
    </>
  )
}

export default ProjectPage;