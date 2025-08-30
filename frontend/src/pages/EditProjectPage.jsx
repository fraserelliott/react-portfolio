import {useSession} from '../contexts/SessionContext.jsx';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useImages} from '../contexts/ImagesContext.jsx';
import {useLocation} from 'react-router-dom';
import {useToast} from '../contexts/ToastContext.jsx';
import TagSelector from '../components/TagSelector.jsx';

const EditProjectPage = () => {
  const {token} = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const {images, loading: imagesLoading, error: imagesError} = useImages();
  const {posts, loading: postsLoading, error: postsError} = useImages();
  const {addToastMessage} = useToast();

  const searchParams = new URLSearchParams(location.search);
  const raw = searchParams.get("id");
  const id = parseInt(raw);
  if (raw && isNaN(id)) {
    addToastMessage('Invalid project id', 'error');
    navigate("/dashboard");
  }

  useEffect(() => {
    if (!token)
      navigate('/login');
  }, [token, navigate]);

  if (!token) return null;
  if (imagesLoading || postsLoading) return null;
  // TODO: error component
  if (imagesError || postsError) return <h1>Error...</h1>;

  return (
    <form className="flex flex-column gap-1 m-1" style={{height: '80%'}}>
      <div className="flex gap-1 align-center">
        <label>Title</label>
        <input className="flex-grow" type="text"/>
        <label>Featured</label>
        <input type="checkbox"/>
        <button onClick={() => navigate("/dashboard")}>X</button>
      </div>
      <div className="flex gap-1 align-center">
        <TagDisplay
        />
        <TagSelector
          buttonText="Select Tags"
        />
      </div>
      <div className="flex gap-1 align-center">
        <label>Summary</label>
        <textarea className="flex-grow" rows="2"/>
      </div>
      <textarea className="flex-grow"/>
      <div className="flex gap-1 justify-center align-center">
        <button>Cancel</button>
        <button>Save</button>
      </div>
    </form>
  );
}

const TagDisplay = ({tags, onRemoveTag}) => {
  return (
    <div className="flex flex-grow flex-wrap">
      {tags && tags.map((tag, index) => {
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

export default EditProjectPage;