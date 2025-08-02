import { useState } from 'react';
import ProjectPreviewPanel from '../components/ProjectPreviewPanel';
import Project from '../components/Project';
import TagFilter from '../components/TagFilter';
import { useGlobalStore } from '../components/GlobalStoreProvider';

const ProjectsPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentProject, setCurrentProject] = useGlobalStore('currentProject');

  return (
    <>
      {!currentProject && (
        <>
          <TagFilter
            selectedTags={selectedTags}
            onFilterUpdate={(tags) => setSelectedTags(tags)}
          />
          <ProjectPreviewPanel
            selectedTags={selectedTags}
            onClick={(project) => setCurrentProject(project)}
          />
        </>
      )}
      {currentProject && <Project project={currentProject} />}
    </>
  );
};

export default ProjectsPage;
