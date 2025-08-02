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

  const saveAndCloseForm = async (formData, uploadData) => {
    let newData = { ...formData };
    newData.tags = formData.tags.map(t => t.id);
    // Upload image if one has been selected
    if (uploadData) {
      try {
        const fileData = new FormData();
        fileData.append("image", uploadData);
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
        if (mode === "edit")
          return prev.map((p) => (p.id === data.id ? data : p))
        else
          return [...prev, data];
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
            onFilterUpdate={(tags) => setSelectedTags(tags)}
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
