import {useSession} from '../contexts/SessionContext.jsx';
import TagSelector from '../components/TagSelector.jsx';
import ProjectPreviewPanel from '../components/ProjectPreviewPanel.jsx';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const DashboardPage = () => {
  const {token} = useSession();
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  if (!token) return null;

  const handleTagFilterUpdate = (tag, isChecked) => {
    setSelectedTags((prev) =>
      isChecked ? [...prev, tag] : prev.filter((t) => t.id !== tag.id)
    );
  };

  return (
    <>
      <div className="flex justify-end horizontal-spacing my-2">
        <button onClick={() => navigate('/editproject')}>New Post</button>
        <TagSelector
          buttonText="Filter"
          selectedTags={selectedTags}
          onTagToggle={(tag, isChecked) =>
            handleTagFilterUpdate(tag, isChecked)
          }
        />
      </div>
      <ProjectPreviewPanel
        selectedTags={selectedTags}
        onClick={(project) => navigate(`/editproject?id=${project.id}`)}
      />
    </>
  );
};

export default DashboardPage;
