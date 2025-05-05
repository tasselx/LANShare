import { NextResponse } from 'next/server';
import { cleanUploads } from '@/lib/file-utils';

export async function POST() {
  try {
    const deletedCount = cleanUploads();
    return NextResponse.json({
      message: 'Uploads directory cleaned successfully',
      deletedCount
    });
  } catch (error) {
    console.error('Error cleaning uploads directory:', error);
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
