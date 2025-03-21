import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/google-drive';
import { uploadSessions } from '../sessionStore/route';

// Set to force-dynamic to prevent caching
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const chunk = formData.get('chunk') as File;
    const uploadId = formData.get('uploadId') as string;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string);
    const totalChunks = parseInt(formData.get('totalChunks') as string);
    
    if (!chunk || !uploadId || isNaN(chunkIndex) || isNaN(totalChunks)) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Log for debugging
    console.log(`Processing chunk ${chunkIndex}/${totalChunks} for uploadId: ${uploadId}`);
    console.log(`Available sessions: ${Array.from(uploadSessions.keys()).join(', ')}`);
    
    const session = uploadSessions.get(uploadId);
    if (!session) {
      console.error(`Session not found for uploadId: ${uploadId}`);
      return NextResponse.json(
        { error: 'Upload session not found', uploadId },
        { status: 404 }
      );
    }
    
    // Initialize chunks array if it doesn't exist or resize it if needed
    if (!session.chunks) {
      session.chunks = new Array(totalChunks).fill(null);
    }
    
    if (session.chunks.length < totalChunks) {
      session.chunks = new Array(totalChunks).fill(null);
    }
    
    // Store the chunk
    const arrayBuffer = await chunk.arrayBuffer();
    session.chunks[chunkIndex] = Buffer.from(arrayBuffer);
    console.log(`Stored chunk ${chunkIndex}/${totalChunks} for uploadId: ${uploadId}`);
    
    // Update the session in the map with the new chunks
    uploadSessions.set(uploadId, {
      ...session,
      chunks: session.chunks,
      timestamp: Date.now() // Update timestamp
    });
    
    // If this is the last chunk, combine all chunks and upload
    if (chunkIndex === totalChunks - 1 && session.chunks.filter(Boolean).length === totalChunks) {
      console.log(`All chunks received for uploadId: ${uploadId}, proceeding with upload`);
      
      // Combine all chunks
      const combinedBuffer = Buffer.concat(session.chunks);
      
      // Create a file-like object
      const file = {
        arrayBuffer: async () => combinedBuffer,
        type: session.fileType,
        name: session.fileName
      };
      
      // Upload the combined file
      const result = await uploadFile(file, session.fileName, session.parentFolderId);
      
      // Clean up the session
      uploadSessions.delete(uploadId);
      console.log(`Upload complete, session ${uploadId} deleted`);
      
      return NextResponse.json({
        fileId: result.id,
        webViewLink: result.link
      });
    }
    
    // If not the last chunk or not all chunks received yet
    return NextResponse.json({
      status: 'chunk-received',
      message: `Chunk ${chunkIndex + 1}/${totalChunks} received`
    });
    
  } catch (error) {
    console.error('Error in upload-chunk API:', error);
    return NextResponse.json(
      { error: 'Failed to process chunk', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}