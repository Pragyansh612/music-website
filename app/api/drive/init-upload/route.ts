import { NextRequest, NextResponse } from 'next/server';
import { uploadSessions } from '../sessionStore/route';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType, parentFolderId } = await req.json();
    const MAIN_FOLDER_ID = '1yRCtRAXTLfWQFyfFeshJgiRJKV5E8FIw';
    
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Generate a unique upload ID with timestamp for better uniqueness
    const uploadId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    console.log(`Creating new upload session: ${uploadId}`);
    
    // Initialize the upload session with an empty chunks array
    uploadSessions.set(uploadId, {
      fileName,
      fileType,
      parentFolderId: parentFolderId || MAIN_FOLDER_ID,
      chunks: [],
      timestamp: Date.now(),
    });
    
    console.log(`Active sessions after creation: ${Array.from(uploadSessions.keys()).join(', ')}`);
    
    return NextResponse.json({ uploadId });
  } catch (error) {
    console.error('Error in init-upload API:', error);
    return NextResponse.json(
      { error: 'Failed to initialize upload' },
      { status: 500 }
    );
  }
}