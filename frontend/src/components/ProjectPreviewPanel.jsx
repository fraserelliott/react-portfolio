import { useGlobalStore } from './GlobalStoreProvider';
import DOMPurify from 'dompurify';
import styles from './ProjectPreviewPanel.module.css';

const ProjectPreviewPanel = (props) => {
  const [projects, setProjects] = useGlobalStore('projects');

  const handleClick = (project) => {
    if (props.onClick) props.onClick(project);
  };

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
          props.selectedTags.some((selected) => selected === tag.id)
        )
      );

    return filteredProjects;
  };

  return (
    <div className={styles.container}>
      {filterProjects().map((project) => (
        <ProjectPreview
          key={project.id}
          project={project}
          onClick={() => handleClick(project)}
        />
      ))}
    </div>
  );
};

const ProjectPreview = ({ project, onClick }) => {
  return (
    <div
      className={styles.project}
    >
      <div className={styles.projectMain} onClick={() => {
        if (onClick) onClick();
      }}>
        <h1 className={styles.centered}>{project.title}</h1>
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
        <a href={project.repoLink} target="_blank">
          <h2 className={styles.centered}>GitHub Link</h2>
        </a>
      </div>
    </div>
  );
};

export default ProjectPreviewPanel;
