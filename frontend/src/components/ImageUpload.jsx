import { useRef, useState } from 'react';

const ImageUpload = ({ uploadData, onFileSelect }) => {
  const fileInputRef = useRef(null);
  

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const clearFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex horizontal-spacing">
      <input className='flex-grow' type="file" ref={fileInputRef} onChange={handleFileChange} />
      {uploadData && (
        <button onClick={() => clearFile()}>Clear</button>
      )}
    </div>
  );
};

export default ImageUpload;
