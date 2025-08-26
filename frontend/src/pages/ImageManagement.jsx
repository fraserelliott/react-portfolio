import {useSession} from '../contexts/SessionContext.jsx';
import {useImages} from '../contexts/ImagesContext.jsx';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {ImageCard} from '../components/ImageCard.jsx';
import {ImageFormModal} from '../components/ImageFormModal.jsx';

const ImageManagement = () => {
  const {token} = useSession();
  const {images, loading, error} = useImages();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!token)
      navigate('/login');
  }, [token, navigate]);

  const openModal = (dbImage) => {
    setShowModal(true);
    setModalImage(dbImage || null);
  }

  const closeModal = () => {
    setShowModal(false);
    setModalImage(null);
  }

  if (!token) return null;
  if (loading) return null;
  // TODO: error component
  if (error) return <h1>Error...</h1>;

  return (
    <>
      <div className="flex m-1 gap-1">
        <button onClick={() => openModal()}>Add Image</button>
        <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>
      <div className="flex flex-wrap gap-1 m-1 justify-center">
        {images.filter(image => image.reference.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())).map((image, index) => (
          <ImageCard key={index} image={image} onEdit={() => openModal(image)}/>
        ))}
      </div>
      {showModal && <ImageFormModal dbImage={modalImage} onClose={closeModal}/>}
    </>
  )
}

export default ImageManagement;