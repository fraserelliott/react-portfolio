import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useProjects } from '../contexts/ProjectsContext.jsx';
import styles from './ProjectPage.module.css';
import MarkdownViewer from '../components/MarkdownViewer.jsx';

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

  return (
    <div className={styles.container}>
      <div className={styles.project}>
        <h1 className={styles.centered}>{project.title}</h1>
        {project.tags.length > 0 && (
          <h2 className={styles.centered}>{project.tags.map((tag) => tag.name).join(', ')}</h2>
        )}
        <a href={project.repoLink} target="_blank">
          <h1 className={styles.centered}>GitHub Link</h1>
        </a>
        {project.imageUrl && (
          <div className={styles.centered}>
            <img src={project.imageUrl} height="150" alt={project.title} />
          </div>
        )}
        <MarkdownViewer className={styles.projectContent}>{project.content}</MarkdownViewer>
      </div>
    </div>
  );
};

export default ProjectPage;
