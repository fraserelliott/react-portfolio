import {useForm, Controller} from 'react-hook-form';
import {ImageSelector} from './ImageSelector.jsx';
import {useImages} from '../contexts/ImagesContext.jsx';

export function ImageFormModal({dbImage, onClose}) {
  const isEdit = !!dbImage;
  const {addImageAsync, updateImageContentAsync, updateImageMetadataAsync} = useImages();

  const {
    control,
    handleSubmit,
    register,
    formState: {errors},
  } = useForm({
    defaultValues: {
      reference: dbImage?.reference ?? '',
      image: null, // will hold File or null
    },
  });

  const handleSave = async (data) => {
    const ref = data.reference.trim();

    if (!isEdit) {
      const fd = new FormData();
      fd.append('image', data.image);
      fd.append('reference', ref);
      await addImageAsync(fd);
      onClose?.();
      return;
    }

    if (ref !== dbImage.reference) {
      await updateImageMetadataAsync(dbImage.id, {reference: ref});
    }
    if (data.image) {
      const fd = new FormData();
      fd.append('image', data.image);
      await updateImageContentAsync(dbImage.id, fd);
    }

    onClose?.();
  };

  return (
    <div className="modal">
      <form className="flex flex-column align-center card" onSubmit={handleSubmit(handleSave)}>
        <div className="flex cardRow">
          <input type="text" className="flex-grow" {...register("reference", {required: true})} />
          <button type="button" onClick={onClose} aria-label="Close dialog">X</button>
        </div>

        <Controller
          name="image"
          control={control}
          rules={{
            validate: (file) => (isEdit || file ? true : 'Please choose an image')
          }}
          render={({field: {onChange}}) => (
            <ImageSelector
              src={dbImage?.url}
              onChange={(payload) => onChange(payload?.file ?? null)}
            />
          )}
        />

        <div className="flex justify-center cardRow">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">{isEdit ? 'Save Changes' : 'Create Image'}</button>
        </div>
      </form>
    </div>
  )
}