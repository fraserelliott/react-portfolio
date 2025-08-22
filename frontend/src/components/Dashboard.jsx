import {useEffect, useState} from 'react';
import {useToast} from '../contexts/ToastContext.jsx';
import ProjectPreviewPanel from './ProjectPreviewPanel';
import TagSelector from './TagSelector';
import ProjectForm from './ProjectForm';
import api from '../api.jsx';
import {useProjects} from '../contexts/ProjectsContext.jsx';
import {useNavigate} from 'react-router-dom';
import {useSession} from '../contexts/SessionContext.jsx';
import project from './Project.jsx';

const Dashboard = () => {
  const {token, logout} = useSession();
  const [mode, setMode] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const {addToastMessage} = useToast();
  const {addProjectAsync, updateProjectAsync, deleteProjectAsync, addTagAsync} = useProjects();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token)
      navigate('/');
  }, [navigate, token]);

  const openForm = (newMode, project) => {
    setMode(newMode);
    setCurrentProject(project);
  };

  const closeForm = () => {
    setMode('');
    setCurrentProject(null);
  };

  const handleTagFilterUpdate = (tag, isChecked) => {
    setSelectedTags((prev) =>
      isChecked ? [...prev, tag] : prev.filter((t) => t.id !== tag.id)
    );
  };

  // Handles deleting a post using the API, then updating the global store's projects state to trigger a UI update.
  const handleDelete = async (project) => {
    await deleteProjectAsync(project.id);
    closeForm();
  };

  /**
   * Handles form submission by:
   * - Validating required fields
   * - Creating new tags if needed
   * - Uploading an image if provided
   * - Sending a POST or PUT request to save the project
   * - Updating the project list and closing the form
   */
  const saveAndCloseForm = async (formData, uploadData) => {
    if (!formData?.title || !formData?.repoLink || !formData?.content) {
      addToastMessage("Title, repo link and content are mandatory fields.", "error");
      return;
    }

    // Keep current tag flow, just guard it a bit
    const submittedTags = Array.isArray(formData.tags) ? formData.tags : [];
    const tagIds = [];

    for (const tag of submittedTags) {
      if (!tag?.id) {
        const created = await addTagAsync(tag); // returns newTag | null via runApi
        if (!created) return; // toast already shown
        tagIds.push(created.id);
      } else {
        tagIds.push(tag.id);
      }
    }

    const newData = {...formData, tags: tagIds};

    // Leave image upload logic as-is for now
    if (uploadData) {
      try {
        const fileData = new FormData();
        fileData.append("image", uploadData);
        const res = await api.post("/api/upload", fileData);
        newData.imageUrl = res.data.url;
      } catch (err) {
        handleApiError(err, "Error uploading image");
        return;
      }
    }

    // Still call centralized helpers (no state drift)
    const ok =
      mode === "edit"
        ? await updateProjectAsync({...newData, id: currentProject.id})
        : await addProjectAsync(newData);

    if (!ok) return;

    addToastMessage(
      mode === "edit" ? "Post successfully updated" : "Post successfully created",
      "success"
    );
    closeForm();
  };

  const handleApiError = (err, fallbackMsg) => {
    addToastMessage(err.response?.data?.error || err.message || fallbackMsg, 'error');
  };

  return (
    <div style={{height: '100%'}}>
      {!mode && (
        <>
          <div className="flex justify-end horizontal-spacing my-2">
            <button onClick={() => logout(false)}>Logout</button>
            <button onClick={() => openForm('create', null)}>New Post</button>
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
            onClick={(project) => openForm('edit', project)}
          />
        </>
      )}
      {mode && (
        <ProjectForm
          project={currentProject}
          mode={mode}
          onCancel={() => closeForm()}
          onSave={(formData, uploadData) =>
            saveAndCloseForm(formData, uploadData)
          }
          onDelete={(project) => handleDelete(project)}
        />
      )}
    </div>
  );
};

export default Dashboard;
