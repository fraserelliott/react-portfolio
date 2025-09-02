import { useSession } from '../contexts/SessionContext.jsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImages } from '../contexts/ImagesContext.jsx';
import { useLocation } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext.jsx';
import TagSelector from '../components/TagSelector.jsx';
import { Controller, useForm } from 'react-hook-form';
import { useProjects } from '../contexts/ProjectsContext.jsx';
import Project from '../components/Project.jsx';

const EditProjectPage = () => {
  const { token } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading: imagesLoading, error: imagesError } = useImages();
  const {
    loading: postsLoading,
    error: postsError,
    addProjectAsync,
    updateProjectAsync,
    getProjectByIdAsync,
  } = useProjects();
  const { addToastMessage } = useToast();
  const [project, setProject] = useState();
  const [previewData, setPreviewData] = useState(null);

  const { control, handleSubmit, register, reset, getValues } = useForm({
    defaultValues: {
      title: '',
      featured: false,
      summary: '',
      repoLink: '',
      content: '',
      tags: [],
    },
  });

  const onPreview = () => {
    setPreviewData(getValues());
  };

  const searchParams = new URLSearchParams(location.search);
  const raw = searchParams.get('id');
  const id = parseInt(raw);
  if (raw && isNaN(id)) {
    addToastMessage('Invalid project id', 'error');
    navigate('/dashboard');
  }

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  useEffect(() => {
    if (id) {
      (async () => {
        const p = await getProjectByIdAsync(id);
        setProject(p);
      })();
    }
  }, [id, getProjectByIdAsync]);

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        featured: project.featured,
        summary: project.summary,
        repoLink: project.repoLink,
        content: project.content,
        tags: project.tags,
      });
    }
  }, [project, reset]);

  const handleEdit = async (data) => {
    let res;
    if (id) res = updateProjectAsync({ ...data, id });
    else res = addProjectAsync(data);
    if (!res) return;
    navigate('/dashboard');
  };

  const displayErrors = (errors) => {};

  // TODO: project loading from id if provided

  if (!token) return null;
  if (imagesLoading || postsLoading) return null;
  // TODO: error component
  if (imagesError || postsError) return <h1>Error...</h1>;

  return (
    <>
      <form
        className="flex flex-column gap-1 m-1"
        style={{ height: '80%' }}
        onSubmit={handleSubmit(handleEdit, displayErrors)}>
        <div className="flex gap-1 align-center">
          <label>Title</label>
          <input className="flex-grow" type="text" {...register('title', { required: true })} />
          <label>Featured</label>
          <input type="checkbox" {...register('featured')} />
          <button type="button" onClick={() => navigate('/dashboard')}>
            X
          </button>
        </div>
        <Controller
          name="tags"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="flex gap-1 align-center">
              <TagDisplay
                tags={value}
                onRemoveTag={(tag) => onChange(value.filter((t) => t.id !== tag.id))}
              />
              <TagSelector value={value} onChange={onChange} allowCreate showUnusedTags />
            </div>
          )}
        />
        <div className="flex gap-1 align-center">
          <label>Repo</label>
          <input className="flex-grow" {...register('repoLink', { required: true })} />
        </div>
        <div className="flex gap-1 align-center">
          <label>Summary</label>
          <textarea className="flex-grow" rows="2" {...register('summary', { required: true })} />
        </div>
        <textarea className="flex-grow" {...register('content', { required: true })} />
        <div className="flex gap-1 justify-center align-center">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-danger">
            Cancel
          </button>
          <button type="button" onClick={() => setPreviewData(getValues())}>
            Preview
          </button>
          <button>Save</button>
        </div>
      </form>
      {previewData && (
        <div className="modal">
          <div className="flex flex-column w-90 h-90">
            <Project project={previewData} />
            <button onClick={() => setPreviewData(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

const TagDisplay = ({ tags, onRemoveTag }) => {
  return (
    <div className="flex flex-grow flex-wrap">
      {tags &&
        tags.map((tag, index) => {
          return (
            <div className="mx-1" key={index}>
              <span className="mx-1">{tag.name}</span>
              <button type="button" className="mx-1" onClick={() => onRemoveTag(tag)}>
                X
              </button>
            </div>
          );
        })}
    </div>
  );
};

export default EditProjectPage;
