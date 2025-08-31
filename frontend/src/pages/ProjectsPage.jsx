import { useState } from 'react';
import ProjectPreviewPanel from '../components/ProjectPreviewPanel';
import TagSelector from '../components/TagSelector';
import { useNavigate } from 'react-router-dom';

const ProjectsPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-end my-2">
        <TagSelector value={selectedTags} buttonText="Filter" onChange={setSelectedTags} />
      </div>
      <ProjectPreviewPanel
        selectedTags={selectedTags}
        onClick={(project) => {
          navigate(`/project?id=${project.id}`);
        }}
      />
    </>
  );
};

export default ProjectsPage;
