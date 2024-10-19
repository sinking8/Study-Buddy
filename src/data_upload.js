import React, { useRef, useState } from 'react';
import AppAppBar from './components/AppAppBar';
import Container from '@mui/material/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Button from '@mui/material/Button';
import './data_upload.scss';

export default function DataUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to array
    setSelectedFiles((prevFiles) => [
      ...prevFiles,
      ...files.map((file) => ({ file, name: file.name, size: file.size })),
    ]);
  };

  const formatFileSize = (size) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index++;
    }
    return `${size.toFixed(2)} ${units[index]}`;
  };

  const removeFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('session_name', 'Your Session Name Here');

    selectedFiles.forEach(({ file }) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://127.0.0.1:8000/create_session', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUploadMessage(`File upload success: ${JSON.stringify(data.uploaded_files)}`);
      setSelectedFiles([]); // Clear selected files after upload
    } catch (error) {
      setUploadMessage(`File upload error: ${error.message}`);
    }
  };

  return (
    <>
      <AppAppBar />
      <Container>
        <div id="app">
          <h2>Upload Files</h2>
          <div className="container">
            <div className="file-input-box">
              <div className="wrapper-file-input">
                <div className="input-box" onClick={openFileInput}>
                  <h4>
                    <FontAwesomeIcon icon={faUpload} />
                    Choose File to upload
                  </h4>
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    multiple
                  />
                </div>
                <small>
                  Files Supported: PDF, TEXT, DOC, DOCX, JPG, PNG, SVG
                </small>
              </div>

              <div className="wrapper-file-section">
                {selectedFiles.length > 0 && (
                  <div className="selected-files">
                    <h5>Selected Files</h5>
                    <ul
                      className="file-list"
                      style={{
                        maxHeight: selectedFiles.length ? '220px' : 'auto',
                      }}
                    >
                      {selectedFiles.map((file, index) => (
                        <li className="item" key={file.name}>
                          <span className="name">
                            {file.name} ({formatFileSize(file.size)})
                          </span>
                          <div
                            className="remove"
                            onClick={() => removeFile(index)}
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedFiles.length > 0 && (
                  <div className="submit-section">
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={handleSubmit}
                      size="small"
                    >
                      Upload Files
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {uploadMessage && <div className="upload-message">{uploadMessage}</div>}
          </div>
        </div>
      </Container>
    </>
  );
}
