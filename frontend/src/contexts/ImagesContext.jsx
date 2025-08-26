import {useState, useEffect, createContext, useCallback, useMemo, useContext} from 'react';
import {useApi} from './ApiContext.jsx';
import api from '../api.jsx';

export const ImagesContext = createContext();

export function ImagesProvider({children}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {runApi} = useApi();

  useEffect(() => {
    let mounted = true;
    (async () => {
      await runApi(api.get('/api/images'), (d) => mounted && setImages(d), "Error loading images", () => mounted && setError(new Error("Failed to load images")));
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    }
  }, [runApi]);

  const addImageAsync = useCallback(async (formData) => {
    return runApi(api.post("/api/images", formData), (newImage) => setImages(prev => [...prev, newImage]), "Error adding image");
  }, [runApi]);

  const updateImageContentAsync = useCallback(async (id, formData) => {
    return runApi(api.put(`/api/images/${id}/content`, formData), (newImage) => setImages(prev => prev.map((image) => image.id === id ? newImage : image)), "Error updating image content");
  }, [runApi])

  const updateImageMetadataAsync = useCallback(async (id, metadata) => {
    return runApi(api.put(`/api/images/${id}/metadata`, metadata), (newImage) => setImages(prev => prev.map((image) => image.id === id ? newImage : image)), "Error updating image metadata");
  }, [runApi])

  const deleteImageAsync = useCallback(async (id) => {
    return runApi(api.delete(`/api/images/${id}`), () => setImages(prev => prev.filter((image) => image.id !== id)), "Error deleting image");
  }, [runApi]);

  const value = useMemo(() => ({
    images, loading, error, addImageAsync, updateImageContentAsync, updateImageMetadataAsync, deleteImageAsync
  }), [images, loading, error, addImageAsync, updateImageContentAsync, updateImageMetadataAsync, deleteImageAsync]);

  return (<ImagesContext.Provider value={value}>
    {children}
  </ImagesContext.Provider>)
}

export const useImages = () => {
  const ctx = useContext(ImagesContext);
  if (!ctx) throw new Error('useImages must be used within <ImagesProvider>');
  return ctx;
};