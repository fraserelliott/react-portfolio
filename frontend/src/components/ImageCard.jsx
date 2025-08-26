import ConfirmPopup from './ConfirmPopup.jsx';
import {useState} from 'react';
import {useImages} from '../contexts/ImagesContext.jsx';

export function ImageCard({image, onEdit}) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const {deleteImageAsync} = useImages();

  const onDelete = () => {
    setShowDeletePopup(false);
    deleteImageAsync(image.id);
  }

  return (
    <>
      <div className="flex flex-column align-center card">
        <span>{image?.reference || ""}</span>
        <img className="flex-grow" src={image?.url || ""} alt={image?.reference || ""}/>
        <div className="flex justify-center cardRow">
          <button className="btn-danger" onClick={() => setShowDeletePopup(true)}>Delete</button>
          <button onClick={onEdit}>Edit</button>
        </div>
      </div>
      {showDeletePopup &&
        <ConfirmPopup
          text="Are you sure you want to delete this image?"
          confirmClass="btn-danger"
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={onDelete}
        />
      }
    </>
  );
}