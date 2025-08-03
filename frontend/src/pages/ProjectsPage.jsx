import { useState } from 'react';
import ProjectPreviewPanel from '../components/ProjectPreviewPanel';
import Project from '../components/Project';
import TagFilter from '../components/TagFilter';
import { useGlobalStore } from '../components/GlobalStoreProvider';

const ProjectsPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentProject, setCurrentProject] = useGlobalStore('currentProject');

  const handleTagFilterUpdate = (tag, isChecked) => {
    setSelectedTags((prev) =>
      isChecked ? [...prev, tag] : prev.filter((t) => t.id !== tag.id)
    );
  };

  return (
    <>
      {!currentProject && (
        <>
          <div className="flex justify-end my-2">
            <TagFilter
              selectedTags={selectedTags}
              onFilterUpdate={(tag, isChecked) =>
                handleTagFilterUpdate(tag, isChecked)
              }
            />
          </div>
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
