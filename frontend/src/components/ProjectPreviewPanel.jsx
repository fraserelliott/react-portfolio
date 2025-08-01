import { useGlobalStore } from './GlobalStoreProvider';
import DOMPurify from 'dompurify';
import styles from './ProjectPreviewPanel.module.css';

const ProjectPreviewPanel = (props) => {
  const [projects, setProjects] = useGlobalStore('projects');

  // Filter projects based on props: featured, searchTerm and selectedTags
  const filterProjects = () => {
    let filteredProjects = [...projects];
    if (props.featured)
      filteredProjects = filteredProjects.filter((project) => project.featured);

    if (props.searchTerm)
      filteredProjects = filteredProjects.filter((project) =>
        project.name
          .toLowerCase()
          .includes(props.searchTerm.toLowerCase().trim())
      );

    // Check if any of the tag IDs within the project match any tag IDs within selectedTags. If selectedTags is empty, then don't filter with it.
    if (props.selectedTags && props.selectedTags.length > 0)
      filteredProjects = filteredProjects.filter((project) =>
        project.tags.some((tag) =>
          props.selectedTags.some((selected) => selected.id === tag.id)
        )
      );

    return filteredProjects;
  };

  return (
    <div className={styles.container}>
      {filterProjects().map((project) => (
        <ProjectPreview key={project.id} project={project} />
      ))}
    </div>
  );
};

const ProjectPreview = ({ project }) => {
  return (
    <div className={styles.project}>
      <a href={project.repoLink}>
        <h1 className={styles.centered}>{project.title}</h1>
      </a>
      {project.tags.length > 0 && (
        <h2 className={styles.centered}>
          {project.tags.map((tag) => tag.name).join(', ')}
        </h2>
      )}
      {project.imageUrl && (
        <div className={styles.centered}>
          <img src={project.imageUrl} height="150" alt={project.title} />
        </div>
      )}
      <p
        className={styles.projectContent}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(project.content),
        }}
      ></p>
    </div>
  );
};

export default ProjectPreviewPanel;
