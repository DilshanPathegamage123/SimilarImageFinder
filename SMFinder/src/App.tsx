import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "./App.css";

function App() {
  const [dataset, setDataset] = useState<File[]>([]);
  const [singleImage, setSingleImage] = useState<File | null>(null);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Handle dataset folder upload
  const onDatasetUpload = (acceptedFiles: File[]) => {
    const formData = new FormData();

    // Append each file directly as "dataset"
    acceptedFiles.forEach((file) => {
      formData.append("dataset", file);
    });

    setDataset(acceptedFiles);

    axios
      .post("https://localhost:7129/api/UploadImageSet", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        console.log("Dataset uploaded successfully");
      })
      .catch((error) => {
        console.error("Error uploading dataset:", error);
      });
  };

  // Handle clearing the dataset
  const clearDataset = () => {
    axios
      .post("https://localhost:7129/api/ClearImageSet")
      .then(() => {
        setDataset([]); // Clear the dataset from state
        console.log("Dataset cleared successfully");
      })
      .catch((error) => {
        console.error("Error clearing dataset:", error);
      });
  };

  // Handle single image upload for similarity search
  const onSingleImageUpload = (acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append("singleImage", acceptedFiles[0]);

    setSingleImage(acceptedFiles[0]);

    axios
      .post("https://localhost:7129/api/FindSimilarImages", formData)
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.error("Error searching for similar images:", error);
      });
  };

  // Dropzone for dataset folder (multiple images) upload
  const {
    getRootProps: getRootPropsDataset,
    getInputProps: getInputPropsDataset,
  } = useDropzone({
    onDrop: onDatasetUpload,
    multiple: true,
    accept: { "image/*": [] }, // Update to object format to fix TypeScript error
  });

  // Dropzone for single image upload
  const {
    getRootProps: getRootPropsSingle,
    getInputProps: getInputPropsSingle,
  } = useDropzone({
    onDrop: onSingleImageUpload,
    multiple: false,
    accept: { "image/*": [] }, // Update to object format to fix TypeScript error
  });

  return (
    <div className="App">
      <h1>Image Similarity Search</h1>

      {/* Dataset upload area */}
      <div {...getRootPropsDataset()} className="upload-box">
        <input {...getInputPropsDataset()} />
        <p>Drag and drop a folder of images here, or click to select files</p>
      </div>

      {/* Display uploaded dataset */}
      {dataset.length > 0 && (
        <div>
          <h5>{dataset.length} images uploaded</h5>
        </div>
      )}

      {/* Clear dataset button */}
      {dataset.length > 0 && (
        <button onClick={clearDataset}>Clear Dataset</button>
      )}

      {/* Single image upload area */}
      <div {...getRootPropsSingle()} className="upload-box">
        <input {...getInputPropsSingle()} />
        <p>Drag and drop a single image here, or click to select one</p>
      </div>

      {/* Display single image */}
      {singleImage && (
        <div>
          <h3>Uploaded Image:</h3>
          <img
            src={URL.createObjectURL(singleImage)}
            alt="Uploaded"
            style={{ maxWidth: "300px", maxHeight: "300px" }}
          />
        </div>
      )}

      {/* Display search results */}
      <div className="search-results">
        {searchResults.map((image, index) => (
          <img
            key={index}
            src={`https://localhost:5001/${image}`}
            alt="Search result"
          />
        ))}
      </div>
    </div>
  );
}

export default App;
