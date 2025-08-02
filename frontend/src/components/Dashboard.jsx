import { useState } from 'react';
import { useGlobalStore } from './GlobalStoreProvider';
import ProjectPreviewPanel from './ProjectPreviewPanel';
import TagFilter from './TagFilter';
import ProjectForm from './ProjectForm';

const Dashboard = () => {
  const [projects, setProjects] = useGlobalStore('projects');
  const [loginData, setLoginData] = useGlobalStore('loginData');
  const [mode, setMode] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  const closeForm = () => {
    setMode('');
    setCurrentProject(null);
  };

  const handleTagFilterUpdate = (tag, isChecked) => {
    setSelectedTags((prev) =>
      isChecked ? [...prev, tag] : prev.filter((t) => t.id !== tag.id)
    );
  };

  const saveAndCloseForm = async (formData, uploadData) => {
    let newData = { ...formData };
    const tagIds = [];

    // Create tags that don't yet have an ID. Strip down tags to only IDs in the new array as that's what the API expects.
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

    // Upload image if one has been selected
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

    // PUT or POST to API depending on whether mode is edit or create
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
          <TagFilter
            selectedTags={selectedTags}
            onFilterUpdate={(tag, isChecked) =>
              handleTagFilterUpdate(tag, isChecked)
            }
          />
          <ProjectPreviewPanel
            selectedTags={selectedTags}
            onClick={(project) => {
              setCurrentProject(project);
              setMode('edit');
            }}
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
        />
      )}
    </div>
  );
};

export default Dashboard;
