import { useState, useEffect, useRef } from 'react'
import './App.css'
import QRCode from 'react-qr-code'

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [serverInfo, setServerInfo] = useState({ ip: '', port: '' });
  const [dragActive, setDragActive] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch server info
    fetch('/api/server-info')
      .then(response => response.json())
      .then(data => setServerInfo(data))
      .catch(error => console.error('Error fetching server info:', error));
  }, []);

  const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      await uploadFileAndGenerateLink(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      await uploadFileAndGenerateLink(selectedFile);
    }
  };

  const uploadFileAndGenerateLink = async (selectedFile: File) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    setUploadProgress(0);

    try {
      // Using fetch API for file upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      // Parse the response
      const data = await response.json();

      // Set upload progress to 100%
      setUploadProgress(100);

      // Set the download URL
      setSelectedFileUrl(data.downloadUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      // Reset progress on error
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCleanup = async () => {
    setCleaning(true);
    setCleanupMessage('');

    try {
      const response = await fetch('/api/cleanup', {
        method: 'POST',
      });

      const data = await response.json();
      setCleanupMessage(`Cleanup successful! Deleted ${data.deletedCount} files.`);

      // Reset file states after cleanup
      setFile(null);
      setSelectedFileUrl('');
      setUploadProgress(0);
    } catch (error) {
      console.error('Error cleaning uploads directory:', error);
      setCleanupMessage('Error cleaning uploads directory.');
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>LANShare</h1>
        <p className="subtitle">Upload and share files on your local network</p>
      </header>

      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input"
          ref={fileInputRef}
        />

        <div className="upload-content">
          {!file ? (
            <>
              <div className="upload-icon">📁</div>
              <p>Drag & drop a file here, or click to select</p>
            </>
          ) : (
            <div className="selected-file">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{formatFileSize(file.size)}</p>

              {uploading ? (
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              ) : (
                <>
                  {selectedFileUrl ? (
                    <div className="file-link-container">
                      <p>File link generated:</p>
                      <a
                        href={selectedFileUrl}
                        className="file-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedFileUrl}
                      </a>
                    </div>
                  ) : (
                    <p>Uploading file will automatically generate a link</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedFileUrl && (
        <div className="copy-link-container">
          <div className="qr-code-container">
            <QRCode
              value={selectedFileUrl}
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "200px" }}
              fgColor="#4a6bff"
            />
            <p className="qr-code-hint">Scan to download</p>
          </div>

          <button
            className="copy-button"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(selectedFileUrl);
              alert('Link copied to clipboard!');
            }}
          >
            Copy Link
          </button>
        </div>
      )}



      {serverInfo.ip && (
        <div className="server-info">
          <h3>LAN Access</h3>
          <p>
            Other devices on your network can access this page at:
            <a
              href={`http://${serverInfo.ip}:${serverInfo.port}`}
              target="_blank"
              rel="noopener noreferrer"
              className="lan-link"
            >
              http://{serverInfo.ip}:{serverInfo.port}
            </a>
          </p>
        </div>
      )}

      <div className="cleanup-container">
        <button
          className="cleanup-button"
          onClick={handleCleanup}
          disabled={cleaning}
        >
          {cleaning ? 'Cleaning...' : 'Clean Uploads Directory'}
        </button>
        {cleanupMessage && <p className="cleanup-message">{cleanupMessage}</p>}
      </div>


    </div>
  )
}

export default App
