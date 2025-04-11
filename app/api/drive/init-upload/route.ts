// init-upload.ts
import { NextRequest, NextResponse } from 'next/server';
import { createUploadSession } from '@/lib/sessionManagement';

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
    
    // Generate a unique upload ID
    const uploadId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Create the upload session in Supabase
    await createUploadSession(uploadId, fileName, fileType, parentFolderId || MAIN_FOLDER_ID);
    
    return NextResponse.json({ uploadId });
  } catch (error) {
    console.error('Error in init-upload API:', error);
    return NextResponse.json(
      { error: 'Failed to initialize upload' },
      { status: 500 }
    );
  }
}