import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { fileName: string } }
) {
  try {
    // The fileName parameter will be URL-encoded, so we need to decode it
    const fileName = decodeURIComponent(params.fileName);
    const filePath = join(process.cwd(), 'uploads', fileName);

    if (existsSync(filePath)) {
      await unlink(filePath);
      return NextResponse.json({ message: 'File deleted successfully' });
    } else {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
