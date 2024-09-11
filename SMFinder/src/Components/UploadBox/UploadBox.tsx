import React from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import UploadIcon from "../../assets/UploadIcon1.png";
import "./UploadBox.css";

interface UploadBoxProps extends DropzoneOptions {
  message: string;
  onFilesAccepted: (acceptedFiles: File[]) => void;
}

const UploadBox: React.FC<UploadBoxProps> = ({
  message,
  onFilesAccepted,
  ...dropzoneOptions
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onFilesAccepted,
    ...dropzoneOptions,
  });

  return (
    <div {...getRootProps()} className="upload-box m-auto mt-2">
      <input {...getInputProps()} />
      <div className="upload-content">
        <img src={UploadIcon} alt="Upload Icon" className="upload-icon" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default UploadBox;
