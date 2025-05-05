# Next-LANShare

A simple and efficient file sharing application for local networks built with Next.js and TypeScript.

## Features

- **Drag & Drop File Upload**: Easy file uploading with visual feedback
- **Real-time Upload Progress**: Track upload progress with a visual progress bar
- **QR Code Generation**: Automatically generates QR codes for easy mobile access
- **LAN Access**: Share files with any device on your local network
- **Copy Link**: One-click copy of download links to clipboard
- **Responsive Design**: Works on desktop and mobile devices
- **Cleanup Tool**: One-click cleanup of all uploaded files

## Tech Stack

- **Next.js 14**: React framework for server-side rendering
- **TypeScript**: Type-safe JavaScript
- **QRCode**: For generating QR codes for mobile access
- **IP**: For detecting local network IP address
- **Formidable**: For handling file uploads

## Project Structure

```
next-lanshare/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   │   ├── cleanup/      # Cleanup API endpoint
│   │   ├── files/        # Files API endpoints
│   │   ├── server-info/  # Server info API endpoint
│   │   └── upload/       # Upload API endpoint
│   ├── components/       # React components
│   ├── globals.css       # Global CSS styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main page component
├── lib/                  # Utility functions
│   ├── file-utils.ts     # File handling utilities
│   └── ip-utils.ts       # IP address utilities
├── middleware.ts         # Next.js middleware for file serving
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── uploads/              # Directory for uploaded files
```

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation and Usage

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3001`

## How It Works

1. The application runs a web server on your local machine (port 3001 by default)
2. When you upload a file, it's stored in the `uploads` directory
3. The app generates a download URL that includes your local IP address
4. Other devices on your network can access the file using this URL or by scanning the QR code
5. The middleware handles serving the files directly from the uploads directory

## API Endpoints

- `GET /api/server-info`: Returns the server's IP address and port
- `POST /api/upload`: Uploads a file to the server
- `GET /api/files`: Lists all uploaded files
- `DELETE /api/files/[fileName]`: Deletes a specific file
- `POST /api/cleanup`: Deletes all uploaded files

## License

This project is open source and available under the MIT License.
