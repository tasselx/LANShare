import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import ip from 'ip';

// Helper function to safely read filenames with special characters
const safeReadDir = async (dir: string) => {
  try {
    return await readdir(dir);
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
};

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'uploads');
    const files = await safeReadDir(uploadsDir);
    const localIP = ip.address();
    const PORT = process.env.PORT || '3001';

    const fileList = await Promise.all(
      files.map(async (file) => {
        try {
          const stats = await stat(join(uploadsDir, file));
          // Properly encode the filename for URL usage
          const encodedFileName = encodeURIComponent(file);

          // For debugging
          console.log('Original filename:', file);
          console.log('Encoded filename:', encodedFileName);

          return {
            name: file,
            size: stats.size,
            downloadUrl: `http://${localIP}:${PORT}/uploads/${encodedFileName}`,
            encodedFileName,
          };
        } catch (err) {
          console.error(`Error processing file ${file}:`, err);
          return null;
        }
      })
    );

    // Filter out null entries
    const validFiles = fileList.filter((item) => item !== null);

    return NextResponse.json(validFiles);
  } catch (error) {
    console.error('Error getting file list:', error);
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
