// upload-chunk.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUploadSession, updateUploadSession, deleteUploadSession } from '@/lib/sessionManagement';
import { uploadFile } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

declare global {
  var uploadChunks: Map<string, Map<number, Buffer>>;
}

// Initialize the global variable for chunk storage
if (typeof global.uploadChunks === 'undefined') {
  global.uploadChunks = new Map<string, Map<number, Buffer>>();
  console.log('Initialized global chunk storage');
}

function getActualChunkCount(chunks: Map<number, Buffer>): number {
  return chunks.size;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const chunk = formData.get('chunk') as File;
    const uploadId = formData.get('uploadId') as string;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string);
    const totalChunks = parseInt(formData.get('totalChunks') as string);

    console.log(`Received chunk ${chunkIndex + 1}/${totalChunks} for upload ${uploadId}`);

    if (!chunk || !uploadId || isNaN(chunkIndex) || isNaN(totalChunks)) {
      console.error('Missing required parameters', { uploadId, chunkIndex, totalChunks, hasChunk: !!chunk });
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if session exists
    const session = await getUploadSession(uploadId);
    if (!session) {
      console.error('Upload session not found', { uploadId });
      return NextResponse.json(
        { error: 'Upload session not found', uploadId },
        { status: 404 }
      );
    }

    try {
      // Store the chunk in memory
      // Initialize storage for this upload if it doesn't exist
      if (!global.uploadChunks.has(uploadId)) {
        global.uploadChunks.set(uploadId, new Map<number, Buffer>());
      }

      // Convert chunk to buffer and store it
      const arrayBuffer = await chunk.arrayBuffer();
      console.log(`Storing chunk ${chunkIndex} (${arrayBuffer.byteLength} bytes)`);
      global.uploadChunks.get(uploadId)?.set(chunkIndex, Buffer.from(arrayBuffer));

      // Update the session with this chunk index
      const allChunksReceived = await updateUploadSession(uploadId, chunkIndex, totalChunks);

      console.log(`Updated session for chunk ${chunkIndex}, allChunksReceived=${allChunksReceived}`);

      // Process file if all chunks are received
      if (allChunksReceived) {
        console.log(`All ${totalChunks} chunks received for ${uploadId}, proceeding with assembly`);

        try {
          // Get all chunks
          const chunks = global.uploadChunks.get(uploadId);
          if (!chunks) {
            throw new Error('Chunks not found in storage');
          }

          // Combine chunks in correct order
          const buffers: Buffer[] = [];
          let missingChunks = [];

          for (let i = 0; i < totalChunks; i++) {
            const buffer = chunks.get(i);
            if (!buffer) {
              missingChunks.push(i);
              continue;
            }
            buffers.push(buffer);
          }

          if (missingChunks.length > 0) {
            console.error(`Missing chunks: ${missingChunks.join(', ')}`);
            throw new Error(`Missing chunks: ${missingChunks.join(', ')}`);
          }

          // Combine all buffers into one
          const completeBuffer = Buffer.concat(buffers);
          console.log(`Assembled file from ${buffers.length} chunks, total size: ${completeBuffer.length} bytes`);

          // Create a File-like object that uploadFile can work with
          const fileObject = {
            arrayBuffer: async () => completeBuffer,
            type: session.file_type,
            name: session.file_name
          };

          // Upload the assembled file to Google Drive
          console.log(`Uploading assembled file to Google Drive: ${session.file_name}`);
          const uploadResult = await uploadFile(fileObject, session.file_name, session.parent_folder_id);

          // Clean up after successful upload
          global.uploadChunks.delete(uploadId);
          await deleteUploadSession(uploadId);

          return NextResponse.json({
            status: 'upload-complete',
            fileId: uploadResult.id,
            webViewLink: uploadResult.link,
            fileName: session.file_name
          });

        } catch (uploadError: any) {
          console.error('Error uploading assembled file:', uploadError);
          return NextResponse.json(
            { error: 'Failed to upload assembled file', details: uploadError?.message || String(uploadError) },
            { status: 500 }
          );
        }
      } else {
        // Get current session and chunks
        const session = await getUploadSession(uploadId);
        const chunks = global.uploadChunks.get(uploadId);

        if (!session || !chunks) {
          return NextResponse.json({
            status: 'chunk-received',
            message: `Chunk ${chunkIndex + 1}/${totalChunks} received`,
            chunksReceived: 0,
            totalChunks: totalChunks
          });
        }

        // Get actual counts
        const storedChunksCount = getActualChunkCount(chunks);
        const recordedChunksCount = session.chunks_received?.length || 0;

        console.log(`Upload ${uploadId} status: ${recordedChunksCount} recorded chunks, ${storedChunksCount} stored chunks, ${totalChunks} total expected`);

        // Check if we might have all chunks but the count is off
        if (storedChunksCount >= totalChunks) {
          console.log(`Potential mismatch: We have ${storedChunksCount} chunks in memory but expected ${totalChunks}`);

          // Try to proceed with the chunks we have
          try {
            // Combine all available buffers
            const buffers: Buffer[] = [];
            const availableChunks = Array.from(chunks.keys()).sort((a, b) => a - b);

            for (const index of availableChunks) {
              buffers.push(chunks.get(index)!);
            }

            const completeBuffer = Buffer.concat(buffers);
            console.log(`Assembled partial file from ${buffers.length} chunks, total size: ${completeBuffer.length} bytes`);

            // Create a File-like object
            const fileObject = {
              arrayBuffer: async () => completeBuffer,
              type: session.file_type,
              name: session.file_name
            };

            // Upload the assembled file to Google Drive
            console.log(`Uploading file to Google Drive with available chunks: ${session.file_name}`);
            const uploadResult = await uploadFile(fileObject, session.file_name, session.parent_folder_id);

            // Clean up after successful upload
            global.uploadChunks.delete(uploadId);
            await deleteUploadSession(uploadId);

            return NextResponse.json({
              status: 'upload-complete',
              fileId: uploadResult.id,
              webViewLink: uploadResult.link,
              fileName: session.file_name,
              note: `Uploaded with ${buffers.length}/${totalChunks} chunks`
            });
          } catch (uploadError: any) {
            console.error('Error uploading file with available chunks:', uploadError);
          }
        }

        // Return normal response for incomplete uploads
        return NextResponse.json({
          status: 'chunk-received',
          message: `Chunk ${chunkIndex + 1}/${totalChunks} received`,
          chunksReceived: recordedChunksCount,
          totalChunks: totalChunks,
          memoryChunks: storedChunksCount
        });
      }
    } catch (innerError: any) {
      console.error('Error processing chunk:', innerError);
      return NextResponse.json(
        { error: 'Failed to process chunk', details: innerError?.message || String(innerError) },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in upload-chunk API:', error);
    return NextResponse.json(
      { error: 'Failed to process chunk', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}