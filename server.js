import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import ip from 'ip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
console.log('Uploads directory path:', uploadsDir);

try {
  if (!fs.existsSync(uploadsDir)) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created successfully');
  } else {
    console.log('Uploads directory already exists');
  }

  // Check if directory is writable
  fs.accessSync(uploadsDir, fs.constants.W_OK);
  console.log('Uploads directory is writable');
} catch (error) {
  console.error('Error setting up uploads directory:', error);
}

// Helper function to safely read filenames with special characters
const safeReadDir = (dir) => {
  try {
    // Use Buffer to handle binary data correctly
    return fs.readdirSync(dir);
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

// Helper function to clean up the uploads directory
const cleanUploads = () => {
  try {
    const files = safeReadDir(uploadsDir);
    let deletedCount = 0;

    for (const file of files) {
      try {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${file}`);
        deletedCount++;
      } catch (err) {
        console.error(`Error deleting file ${file}:`, err);
      }
    }

    console.log(`Cleaned up uploads directory. Deleted ${deletedCount} files.`);
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning uploads directory:', error);
    return 0;
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 1024 * 1024 * 1024 // 1GB max file size
  },
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'lanshare/dist')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API endpoint to upload a file
app.post('/api/upload', async (req, res) => {
  console.log('Received upload request');
  try {
    console.log('Request files:', req.files ? 'Files present' : 'No files');

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files were uploaded');
      return res.status(400).json({ message: 'No files were uploaded' });
    }

    const file = req.files.file;
    console.log('File details:', {
      name: file.name,
      size: file.size,
      mimetype: file.mimetype
    });

    const filePath = path.join(uploadsDir, file.name);
    console.log('File will be saved to:', filePath);

    // Move the file to the uploads directory
    await file.mv(filePath);
    console.log('File moved successfully');

    // Generate download URL
    const localIP = ip.address();
    console.log('Local IP address:', localIP);

    // Properly encode the filename for URL usage
    const encodedFileName = encodeURIComponent(file.name);
    const downloadUrl = `http://${localIP}:${PORT}/uploads/${encodedFileName}`;
    console.log('Generated download URL:', downloadUrl);

    // Log for debugging
    console.log('Uploaded file name:', file.name);
    console.log('Encoded file name:', encodedFileName);

    const responseData = {
      message: 'File uploaded successfully',
      fileName: file.name,
      fileSize: file.size,
      downloadUrl,
      encodedFileName
    };

    console.log('Sending response:', responseData);
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// API endpoint to get list of uploaded files
app.get('/api/files', (_, res) => {
  try {
    // Use our safe directory reading function with UTF-8 encoding
    const files = safeReadDir(uploadsDir);
    const localIP = ip.address();

    const fileList = files.map(file => {
      try {
        const stats = fs.statSync(path.join(uploadsDir, file));
        // Properly encode the filename for URL usage
        const encodedFileName = encodeURIComponent(file);

        // For debugging
        console.log('Original filename:', file);
        console.log('Encoded filename:', encodedFileName);

        return {
          name: file,
          size: stats.size,
          downloadUrl: `http://${localIP}:${PORT}/uploads/${encodedFileName}`,
          encodedFileName
        };
      } catch (err) {
        console.error(`Error processing file ${file}:`, err);
        return null;
      }
    }).filter(item => item !== null); // Remove any null entries

    return res.status(200).json(fileList);
  } catch (error) {
    console.error('Error getting file list:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// API endpoint to delete a file
app.delete('/api/files/:fileName', (req, res) => {
  try {
    // The fileName parameter will be URL-encoded, so we need to decode it
    const fileName = decodeURIComponent(req.params.fileName);
    const filePath = path.join(uploadsDir, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.status(200).json({ message: 'File deleted successfully' });
    } else {
      return res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// API endpoint to clean up the uploads directory
app.post('/api/cleanup', (_, res) => {
  try {
    const deletedCount = cleanUploads();
    return res.status(200).json({
      message: 'Uploads directory cleaned successfully',
      deletedCount
    });
  } catch (error) {
    console.error('Error cleaning uploads directory:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get server info including IP address
app.get('/api/server-info', (_, res) => {
  const localIP = ip.address();
  res.json({
    ip: localIP,
    port: PORT
  });
});

// Catch all other routes and return the index.html file
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'lanshare/dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  const localIP = ip.address();
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`LAN access: http://${localIP}:${PORT}`);
});
