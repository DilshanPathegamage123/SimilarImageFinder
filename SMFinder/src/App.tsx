import React, { useState } from 'react';  // Import React and useState for managing state
import axios from 'axios';  // Axios for handling HTTP requests to the backend
import { useDropzone, Accept } from 'react-dropzone';  // Dropzone for drag-and-drop functionality
import './App.css';  // Import the CSS file for styling

function App() {
  const [dataset, setDataset] = useState<File[]>([]);  // Store the uploaded dataset (multiple images)
  const [singleImage, setSingleImage] = useState<File | null>(null);  // Store a single image for similarity search
  const [searchResults, setSearchResults] = useState([]);  // Store search results from the backend

  const onDatasetUpload = (acceptedFiles: File[]) => {
    const formData = new FormData();  // FormData object to bundle the dataset files
    acceptedFiles.forEach((file) => {
      formData.append('dataset', file);  // Append each file to the FormData object
    });

    // Update the dataset state to display the names
    setDataset(acceptedFiles);

    axios.post('https://localhost:5001/api/upload-dataset', formData)
      .then(response => {
        console.log('Dataset uploaded successfully');
      })
      .catch(error => {
        console.error('Error uploading dataset:', error);
      });
  };

  const onSingleImageUpload = (acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append('singleImage', acceptedFiles[0]);  // Only one image is uploaded for similarity search

    // Update the singleImage state to display the name
    setSingleImage(acceptedFiles[0]);

    axios.post('https://localhost:5001/api/find-similar', formData)
      .then(response => {
        setSearchResults(response.data);  // Set the search results in the state
      })
      .catch(error => {
        console.error('Error searching for similar images:', error);
      });
  };

  // Dropzone configuration for dataset (folder of images) upload
  const { getRootProps: getRootPropsDataset, getInputProps: getInputPropsDataset } = useDropzone({
    onDrop: onDatasetUpload,  // Trigger dataset upload when files are dropped
    multiple: true,  // Allow multiple files (a dataset)
    noClick: false,  // Allow users to both click and drag to select files
    accept: 'image/*' as unknown as Accept,  // Specify that only image files are allowed
  });

  // Dropzone configuration for single image upload
  const { getRootProps: getRootPropsSingle, getInputProps: getInputPropsSingle } = useDropzone({
    onDrop: onSingleImageUpload,  // Trigger single image upload when a file is dropped
    multiple: false,  // Allow only one file for similarity search
    accept: 'image/*' as unknown as Accept,   // Specify that only image files are allowed
  });

  // Function to clear the dataset
  const clearDataset = () => {
    axios.post('https://localhost:5001/api/clear-dataset')  // API call to clear the dataset
      .then(response => {
        console.log("Dataset cleared");
        setDataset([]);  // Clear the dataset in the state
      })
      .catch(error => {
        console.error("Error clearing dataset", error);
      });
  };

  return (
    <div className="App">
      <h1>Image Similarity Search</h1>

      {/* Drag-and-drop area for dataset (multiple images or folder of images) */}
      <div {...getRootPropsDataset()} className="upload-box">
        <input {...getInputPropsDataset()} {...{ webkitdirectory: "true", directory: "true" }} />
        <p>Drag and drop a folder of images here, or click to select files</p>
      </div>

      {/* Display the names of the selected files for the dataset */}
      {dataset.length > 0 && (
        <div>
          <h5>{dataset.length} images are uploaded</h5>
         
        </div>
      )}

      {/* Button to clear the dataset */}
      <button onClick={clearDataset}>Clear Selected Files</button>

      {/* Drag-and-drop area for a single image upload */}
      <div {...getRootPropsSingle()} className="upload-box">
        <input {...getInputPropsSingle()} />
        <p>Drag and drop a single image here, or click to select one</p>
      </div>


      {/* Display the uploaded single image */}
{singleImage && (
  <div>
    <h3>Uploaded Image:</h3>
    <img 
      src={URL.createObjectURL(singleImage)} 
      alt="Selected Image" 
      style={{ maxWidth: '300px', maxHeight: '300px' }}  // Adjust size as needed
    />
  </div>
)}

      {/* Display search results (list of images) */}
      <div className="search-results">
        {searchResults.map((image, index) => (
          <img key={index} src={`https://localhost:5001/${image}`} alt="search result" />
        ))}
      </div>
    </div>
  );
}

export default App;
