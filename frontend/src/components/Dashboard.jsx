import { useState } from 'react';
import { useGlobalStore, useToast } from '../components/GlobalStoreProvider';
import ProjectPreviewPanel from './ProjectPreviewPanel';
import TagSelector from './TagSelector';
import ProjectForm from './ProjectForm';

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
      const res = await fetch(`http://127.0.0.1:3001/api/posts/${project.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
      });

      if (!res.ok) {
        checkAuthFail(res);
        const { error } = await res.json();
        addToastMessage(error, 'error');
        return;
      }

      const data = await res.json();
      setProjects((prev) => prev.filter((p) => p.id !== data.id));
      closeForm();
      addToastMessage('Post successfully deleted.', 'success');
    } catch (err) {
      addToastMessage(err.message || 'Error deleting post.', 'error');
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
          const res = await fetch('http://127.0.0.1:3001/api/tags', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${loginData.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(tag),
          });

          if (!res.ok) {
            checkAuthFail(res);
            const { error } = await res.json();
            addToastMessage(error, 'error');
            return;
          }

          const data = await res.json();
          tagIds.push(data.id);
        } catch (err) {
          addToastMessage(err.message || 'Error creating tag.', 'error');
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
        const res = await fetch('http://127.0.0.1:3001/api/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${loginData.token}`,
          },
          body: fileData,
        });

        if (!res.ok) {
          checkAuthFail(res);
          const { error } = await res.json();
          addToastMessage(error, 'error');
          return;
        }

        const data = await res.json();
        newData.imageUrl = data.url;
      } catch (err) {
        addToastMessage(err.message || 'Error uploading image.', 'error');
        return;
      }
    }

    // Decide whether to create a new post or update an existing one based on the mode.
    const url = `http://127.0.0.1:3001/api/posts${
      mode === 'edit' ? '/' + currentProject.id : ''
    }`;
    try {
      const res = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${loginData.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (!res.ok) {
        checkAuthFail(res);
        const { error } = await res.json();
        addToastMessage(error, 'error');
        return;
      }

      const data = await res.json();

      // After saving, update the project list in state—replacing or appending depending on mode.
      setProjects((prev) => {
        if (mode === 'edit')
          return prev.map((p) => (p.id === data.id ? data : p));
        else return [...prev, data];
      });
    } catch (err) {
      addToastMessage(
        err.message || 'Error updating or creating post',
        'error'
      );
      return;
    }

    if (mode === 'edit')
      addToastMessage('Post successfully updated.', 'success');
    else addToastMessage('Post successfully created.', 'success');

    closeForm();
  };

  // Force logout on API authorisation error, used in every API call that requires auth.
  const checkAuthFail = (res) => {
    if (res.status == 401) logout(true);
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
