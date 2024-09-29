import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ImgIcon from "./assets/Imgicon.png";
import UploadBox from "./Components/UploadBox/UploadBox";
import "./App.css";

function App() {
  const [dataset, setDataset] = useState<File[]>([]);
  const [singleImage, setSingleImage] = useState<File | null>(null);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchTriggered, setSearchTriggered] = useState(false);

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
    setSingleImage(acceptedFiles[0]);
  };

  // Handle search when the search button is clicked
  const handleSearch = () => {
    if (singleImage) {
      const formData = new FormData();
      formData.append("singleImage", singleImage);

      Swal.fire({
        title: "Searching",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Show loading indicator
        },
      });

      axios
        .post("https://localhost:7129/api/FindSimilarImages", formData)
        .then((response) => {
          setSearchResults(response.data);
          setSearchTriggered(true); // Trigger search

          // Update SweetAlert to show success message
          Swal.fire({
            title: "Search Completed!",
            text: "We found similar images.",
            icon: "success",
            timer: 2500, // Auto close after 2.5 seconds
          });
        })
        .catch((error) => {
          console.error("Error searching for similar images:", error);
          // Update SweetAlert to show error message
          Swal.fire({
            title: "Error!",
            text: "Error searching for similar images.",
            icon: "error",
          });
        });
    }
  };

  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="Heading m-auto mt-4 mb-5">
          <h2> Find Similar Images in your Large Image Set</h2>
        </div>

        <div className="UploadArea col col-12 col-md-3">
          {/* Dataset upload area */}
          <h5 className="mt-2 mb-4">Upload Here</h5>
          <UploadBox
            message="Drop a folder of images here, or click to select"
            onFilesAccepted={onDatasetUpload}
            multiple={true}
            accept={{ "image/*": [] }}
          />

          {/* Display uploaded dataset */}
          {dataset.length > 0 && (
            <div>
              <p className="mt-2">{dataset.length} images uploaded</p>
            </div>
          )}

          {/* Single image upload area */}
          <UploadBox
            message="Drag and drop a single image here, or click to select one"
            onFilesAccepted={onSingleImageUpload}
            multiple={false}
            accept={{ "image/*": [] }}
          />

          {/* Clear dataset button */}
          {dataset.length > 0 && (
            <button className=" clearbtn mt-3" onClick={clearDataset}>
              Clear Uploads
            </button>
          )}
        </div>

        <div className="ResultArea col-12 col-md-9 ">
          <div className="row">
            <div className="Uploaded-img col-12 col-md-3  mb-3">
              {/* Display single image */}
              {singleImage ? (
                <div>
                  <h5 className="mt-2">Uploaded Image</h5>
                  <img
                    src={URL.createObjectURL(singleImage)}
                    alt="Uploaded"
                    style={{ maxWidth: "250px", maxHeight: "350px" }}
                  />
                </div>
              ) : (
                <div>
                  <h5 className="mt-2 mb-4">No Image Uploaded</h5>
                  <img
                    src={ImgIcon}
                    alt="Image Icon"
                    className="ImgIcon m-auto"
                  />
                </div>
              )}
              {/* Search button */}
              <button className="mt-5" onClick={handleSearch}>
                Find Similar Images
              </button>
            </div>
            {/* Display search results */}
            <div className="search-results row col-12 col-md-8 ms-4">
              <h5 className="mt-2">Similar Images</h5>
              {searchTriggered && searchResults.length === 0 && (
                <p className="text-center mt-2">No similar images found</p>
              )}
              {!searchTriggered && (
                <p className="text-center mt-2">No search has been performed</p>
              )}
              {searchResults.map((image, index) => (
                <div key={index} className="col-6 col-md-4 mb-3">
                  <img
                    src={`https://localhost:7129${
                      image.startsWith("/") ? image : "/" + image
                    }`}
                    alt="Search result"
                    className="img-fluid"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/150";
                      e.currentTarget.alt = "Image not available";
                    }}
                  />
                  <p className="text-center mt-2">
                    {image.replace("/dataset/", "")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
