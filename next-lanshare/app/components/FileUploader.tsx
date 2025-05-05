'use client';

import { useState, useRef } from 'react';
import QRCode from 'qrcode';

interface FileUploaderProps {
  serverInfo: {
    ip: string;
    port: string;
  };
}

export default function FileUploader({ serverInfo }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string>('');
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Use XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();

      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Create a promise to handle the XHR response
      const uploadPromise = new Promise<{
        downloadUrl: string;
        fileName: string;
        fileSize: number;
        encodedFileName: string;
      }>((resolve, reject) => {
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = function() {
          reject(new Error('Network error'));
        };
      });

      // Start the upload
      xhr.open('POST', '/api/upload', true);
      xhr.send(formData);

      // Wait for the upload to complete
      const data = await uploadPromise;
      console.log('Upload successful:', data);

      // Set the download URL immediately
      setSelectedFileUrl(data.downloadUrl);

      // Generate QR code for the download URL
      try {
        const qrCodeUrl = await QRCode.toDataURL(data.downloadUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#4a6bff',
            light: '#ffffff'
          }
        });
        setQRCodeDataURL(qrCodeUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
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

  return (
    <>
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
          {/* Always show QR code above the Copy Link button */}
          {qrCodeDataURL && (
            <div className="qr-code-container">
              <img src={qrCodeDataURL} alt="QR Code for download link" className="qr-code" />
              <p className="qr-code-hint">Scan to download</p>
            </div>
          )}
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
    </>
  );
}
