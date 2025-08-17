import {useState} from 'react';
import ProjectPreviewPanel from '../components/ProjectPreviewPanel';
import Project from '../components/Project';
import TagSelector from '../components/TagSelector';
import {useNavigate} from 'react-router-dom';

const ProjectsPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  const handleTagFilterUpdate = (tag, isChecked) => {
    setSelectedTags((prev) => isChecked ? [...prev, tag] : prev.filter((t) => t.id !== tag.id));
  };

  return (<>
    <div className="flex justify-end my-2">
      <TagSelector
        buttonText="Filter"
        selectedTags={selectedTags}
        onTagToggle={(tag, isChecked) => handleTagFilterUpdate(tag, isChecked)}
      />
    </div>
    <ProjectPreviewPanel
      selectedTags={selectedTags}
      onClick={(project) => {
        navigate(`/project?id=${project.id}`);
      }}
    />
  </>);
};

export default ProjectsPage;
