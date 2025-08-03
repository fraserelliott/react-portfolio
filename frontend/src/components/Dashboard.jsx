import { useState } from 'react';
import { useGlobalStore } from './GlobalStoreProvider';
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

  // TODO: checkAuthFail to force logout on protected routes failing

  const logout = () => {
    sessionStorage.removeItem('loginData');
    setLoginData(null);
    setCurrentPage('home');
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
        const errorMsg = await res.text();
        // TODO: error message
        console.error('Error deleting post', res.status, errorMsg);
        return;
      }

      const data = await res.json();
      setProjects((prev) => prev.filter((p) => p.id !== data.id));
      closeForm();
    } catch (err) {
      console.error('Error deleting post', err);
      // TODO: error message
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
      // TODO: error message
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
            // TODO: error message
            console.error('Tag creation failed');
            return;
          }

          const data = await res.json();
          tagIds.push(data.id);
        } catch (err) {
          console.error('Error creating tag', err);
          // TODO: error message
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
          // TODO: error message
          console.error('Upload failed');
          return;
        }

        const data = await res.json();
        newData.imageUrl = data.url;
      } catch (err) {
        console.error('Upload error', err);
        // TODO: error message
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

      const data = await res.json();

      // After saving, update the project list in state—replacing or appending depending on mode.
      setProjects((prev) => {
        if (mode === 'edit')
          return prev.map((p) => (p.id === data.id ? data : p));
        else return [...prev, data];
      });
    } catch (err) {
      console.error('Update/creation error', err);
      // TODO: error message
      return;
    }

    closeForm();
  };

  return (
    <div style={{ height: '100%' }}>
      {!mode && (
        <>
          <div className="flex justify-end horizontal-spacing my-2">
            <button onClick={() => logout()}>Logout</button>
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
