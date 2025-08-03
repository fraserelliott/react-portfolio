import { useState, useEffect } from 'react';
import TagFilter from './TagFilter';
import ImageUpload from './ImageUpload';

const BLANK_FORM = {
  title: '',
  featured: false,
  tags: [],
  imageUrl: '',
  repoLink: '',
  content: '',
};

const ProjectForm = ({ project, mode, onCancel, onSave }) => {
  const [formData, setFormData] = useState(BLANK_FORM);
  const [uploadData, setUploadData] = useState(null);

  useEffect(() => {
    if (project) setFormData({ ...project });
    else setFormData(BLANK_FORM);
  }, [project]);

  // TODO: delete button

  const handleTagFilterUpdate = (tag, isChecked) => {
    setFormData({
      ...formData,
      tags: isChecked
        ? [...formData.tags, tag]
        : formData.tags.filter((t) => t.name !== tag.name),
    });
  };

  return (
    <div
      className="panel flex flex-column vertical-spacing"
      style={{ height: '90%' }}
    >
      <div className="flex horizontal-spacing">
        <input
          className="flex-grow"
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <label htmlFor="featured">Featured:</label>
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, featured: e.target.checked }))
          }
        />
      </div>
      <div className="flex">
        {/* Show currently selected tags and allow removing them */}
        <TagDisplay
          tags={formData.tags}
          onRemoveTag={(tag) => handleTagFilterUpdate(tag, false)}
        />
        {/* TagFilter used here to select/add new tags *for this project* (not for filtering project list) */}
        <TagFilter
          selectedTags={formData.tags}
          onFilterUpdate={(tag, isChecked) =>
            handleTagFilterUpdate(tag, isChecked)
          }
          onCreateTag={(tag) => handleTagFilterUpdate(tag, true)}
        />
      </div>
      <input
        type="text"
        placeholder="Repo link"
        value={formData.repoLink}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, repoLink: e.target.value }))
        }
      />
      {/* Display the final image URL after upload (read-only) */}
      <input type="text" readOnly value={formData.imageUrl} />
      <ImageUpload
        uploadData={uploadData}
        onFileSelect={(data) => setUploadData(data)}
      />
      <textarea
        className="flex-grow"
        value={formData.content}
        placeholder="content"
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, content: e.target.value }))
        }
      />
      <div className="flex justify-between">
        <div />
        <div className="flex horizontal-spacing">
          <button onClick={() => onCancel()}>Cancel</button>
          <button onClick={() => onSave(formData, uploadData)}>
            Save & Close
          </button>
        </div>
        <div>
          {mode === 'edit' && <button className="btn-danger">Delete</button>}
        </div>
      </div>
    </div>
  );
};

const TagDisplay = ({ tags, onRemoveTag }) => {
  return (
    <div className="flex flex-grow flex-wrap">
      {tags.map((tag, index) => {
        return (
          <div className="mx-1" key={index}>
            <span className="mx-1">{tag.name}</span>
            <button className="mx-1" onClick={() => onRemoveTag(tag)}>
              X
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectForm;
