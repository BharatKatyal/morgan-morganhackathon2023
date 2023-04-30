import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const styles = {
  dropzone: {
    border: '2px dashed #ccc',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
  },
};

const DragAndDrop = () => {
  const onDrop = useCallback((acceptedFiles) => {
    // Alert the number of accepted files
    alert(`Number of files: ${acceptedFiles.length}`);

    // Do something with the files
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  return (
    <div {...getRootProps()} style={styles.dropzone}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default DragAndDrop;
