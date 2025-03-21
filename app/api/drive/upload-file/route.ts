import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/google-drive';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '200mb',
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const parentFolderId = formData.get('parentFolderId') as string;
    const fileName = formData.get('fileName') as string || file.name;
    
    if (!file || !parentFolderId) {
      return NextResponse.json(
        { error: 'File and parent folder ID are required' },
        { status: 400 }
      );
    }
    
    const result = await uploadFile(file, fileName, parentFolderId);
    
    return NextResponse.json({
      fileId: result.id,
      webViewLink: result.link
    });
  } catch (error) {
    console.error('Error in upload-file API:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}