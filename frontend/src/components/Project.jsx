import MarkdownViewer from './MarkdownViewer';
import styles from './Project.module.css';

const Project = ({ project }) => {
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

export default Project;
