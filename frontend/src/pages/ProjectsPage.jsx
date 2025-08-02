import { useState } from 'react';
import ProjectPreviewPanel from '../components/ProjectPreviewPanel';
import TagFilter from '../components/TagFilter';

const ProjectsPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedProject, setSelectedProject] = useState();

  return (
    <>
      <TagFilter
        selectedTags={selectedTags}
        onFilterUpdate={(tags) => setSelectedTags(tags)}
      />
      <ProjectPreviewPanel selectedTags={selectedTags} />
    </>
  );
};

export default ProjectsPage;
