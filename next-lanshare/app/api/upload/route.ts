import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import ip from 'ip';
import { existsSync } from 'fs';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';

// Disable body parsing, we'll handle it ourselves with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data
const parseFormData = async (req: NextRequest) => {
  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: join(process.cwd(), 'uploads'),
      keepExtensions: true,
      maxFileSize: 1024 * 1024 * 1024, // 1GB
    });
    
    const chunks: Buffer[] = [];
    req.body?.getReader().read().then(function process({ done, value }) {
      if (done) {
        const buffer = Buffer.concat(chunks);
        form.parse(buffer, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
        return;
      }
      
      chunks.push(Buffer.from(value));
      return req.body?.getReader().read().then(process);
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ message: 'No files were uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create file path
    const filePath = join(uploadsDir, file.name);
    
    // Write the file
    await writeFile(filePath, buffer);
    
    // Generate download URL
    const localIP = ip.address();
    const PORT = process.env.PORT || '3001';
    
    // Properly encode the filename for URL usage
    const encodedFileName = encodeURIComponent(file.name);
    const downloadUrl = `http://${localIP}:${PORT}/uploads/${encodedFileName}`;
    
    // Log for debugging
    console.log('Uploaded file name:', file.name);
    console.log('Encoded file name:', encodedFileName);
    
    return NextResponse.json({
      message: 'File uploaded successfully',
      fileName: file.name,
      fileSize: file.size,
      downloadUrl,
      encodedFileName
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
