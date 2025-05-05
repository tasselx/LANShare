# LANShare

LANShare is a simple web application that allows you to easily share files on your local network. It provides a convenient way to transfer files between devices without the need for external services or complicated setup.

## Features

- **Easy File Sharing**: Upload files with drag-and-drop or file selection
- **Real-time Progress**: View upload progress in real-time
- **QR Code Generation**: Automatically generates QR codes for easy mobile access
- **LAN Access**: Share files with any device on your local network
- **Copy Link**: Easily copy download links to clipboard
- **Clean Interface**: Simple and intuitive user interface
- **Cleanup Tool**: One-click cleanup of uploaded files

## Technologies Used

- **Next.js**: React framework for server-side rendering
- **TypeScript**: Type-safe JavaScript
- **QR Code**: For generating QR codes for easy mobile access
- **IP**: For detecting local network IP address
- **Formidable**: For handling file uploads

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/LANShare.git
   cd LANShare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Start the production server:
   ```bash
   npm start
   ```

## Usage

1. Start the server using one of the commands above
2. Open your browser and navigate to `http://localhost:3001`
3. Upload a file by dragging and dropping or clicking to select
4. Once uploaded, a download link and QR code will be generated
5. Share the link or QR code with other devices on your network
6. Other devices can access the file by visiting the link or scanning the QR code
7. Use the "Clean Uploads Directory" button to remove all uploaded files when needed

## How It Works

LANShare runs a web server on your local machine and creates a simple interface for uploading files. When you upload a file, it's stored in the `uploads` directory on the server. The application then generates a download link that includes your local IP address, making the file accessible to any device on your local network.

The QR code feature makes it especially easy to share files with mobile devices - just scan the code and download the file directly.

## Screenshots

*Coming soon*

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
