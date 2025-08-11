import { useState } from 'react';
import { useGlobalStore, useToast } from './GlobalStoreProvider.jsx';
import ProjectPreviewPanel from './ProjectPreviewPanel';
import TagSelector from './TagSelector';
import ProjectForm from './ProjectForm';
import api from '../api.jsx';

const Dashboard = () => {
  const [projects, setProjects] = useGlobalStore('projects');
  const [loginData, setLoginData] = useGlobalStore('loginData');
  const [currentPage, setCurrentPage] = useGlobalStore('currentPage');
  const [mode, setMode] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const { addToastMessage } = useToast();

  const logout = (forced) => {
    sessionStorage.removeItem('loginData');
    setLoginData(null);
    setCurrentPage('home');
    if (forced) addToastMessage("You've been logged out.", 'error');
    else addToastMessage("You've been logged out.", 'success');
  };

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
    try {
      const res = await api.delete(`/api/posts/${project.id}`);
      setProjects((prev) => prev.filter((p) => p.id !== res.data.id));
      closeForm();
      addToastMessage('Post successfully deleted.', 'success');
    } catch (err) {
      handleApiError(err, "Error deleting post.");
      return;
    }
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
    let newData = { ...formData };

    if (!newData.title || !newData.repoLink || !newData.content) {
      addToastMessage(
        'Title, repo link and content are mandatory fields.',
        'error'
      );
      return;
    }

    const tagIds = [];
    // Loop through submitted tags. Create new ones via the API if they don't have an ID yet, and collect all tag IDs into an array for the final post payload.

    for (const tag of formData.tags) {
      if (!tag.id) {
        try {
          const res = await api.post('/api/tags', tag);
          tagIds.push(res.data.id);
        } catch (err) {
          handleApiError(err, "Error creating tag.");
          return;
        }
      } else {
        tagIds.push(tag.id);
      }
    }
    newData.tags = tagIds;

    // If an image was provided, upload it and attach the resulting URL to the post data.
    if (uploadData) {
      try {
        const fileData = new FormData();
        fileData.append('image', uploadData);
        const res = await api.post('/api/upload', fileData);
        newData.imageUrl = res.data.url;
      } catch (err) {
        handleApiError(err, "Error uploading image");
        return;
      }
    }

    // Decide whether to create a new post or update an existing one based on the mode.
    try {
      const res = mode === 'edit'
          ? await api.put(`/api/posts/${currentProject.id}`, newData)
          : await api.post('/api/posts', newData);

      const data = res.data;
      // After saving, update the project list in state—replacing or appending depending on mode.
      setProjects((prev) => {
        if (mode === 'edit')
          return prev.map((p) => (p.id === data.id ? data : p));
        else return [...prev, data];
      });
    } catch (err) {
      handleApiError(err, "Error updating or creating post.");
      return;
    }

    if (mode === 'edit')
      addToastMessage('Post successfully updated.', 'success');
    else addToastMessage('Post successfully created.', 'success');

    closeForm();
  };

  const handleApiError = (err, fallbackMsg) => {
    addToastMessage(err.response?.data?.error || err.message || fallbackMsg, 'error');
  };

  return (
    <div style={{ height: '100%' }}>
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
