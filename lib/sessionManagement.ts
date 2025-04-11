import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Define the session type to match your database schema
interface UploadSession {
  upload_id: string;
  file_name: string;
  file_type: string;
  parent_folder_id: string;
  timestamp: number;
  chunks_received: number[];
}

// Type guard function to verify if an object is an UploadSession
function isUploadSession(obj: any): obj is UploadSession {
  return (
    typeof obj === 'object' &&
    typeof obj.upload_id === 'string' &&
    typeof obj.file_name === 'string' &&
    typeof obj.file_type === 'string' &&
    typeof obj.parent_folder_id === 'string' &&
    typeof obj.timestamp === 'number' &&
    Array.isArray(obj.chunks_received)
  );
}

// Create a separate server-side Supabase client for API routes
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

// Initialize the admin client only on the server side
if (typeof window === 'undefined') {
  // For development fallback - use anon key if service key is not available
  const fallbackKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const keyToUse = supabaseServiceKey || fallbackKey;

  if (!supabaseUrl || !keyToUse) {
    console.error('Missing Supabase environment variables for server operations');
  } else {
    supabaseAdmin = createClient(supabaseUrl, keyToUse);
    console.log('Supabase admin client initialized');
  }
}

export async function createUploadSession(uploadId: string, fileName: string, fileType: string, parentFolderId: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  // Create the session data explicitly typed
  const sessionData = {
    upload_id: uploadId,
    file_name: fileName,
    file_type: fileType,
    parent_folder_id: parentFolderId,
    timestamp: Date.now(),
    chunks_received: [] as number[]
  };

  const { error } = await supabaseAdmin
    .from('upload_sessions')
    .insert(sessionData);
    
  if (error) throw error;
}

export async function getUploadSession(uploadId: string): Promise<UploadSession | null> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  const { data, error } = await supabaseAdmin
    .from('upload_sessions')
    .select('*')
    .eq('upload_id', uploadId)
    .single();
    
  if (error || !data) return null;
  
  // Verify that data has the expected structure
  if (!isUploadSession(data)) {
    console.error('Retrieved data does not match UploadSession structure', data);
    return null;
  }
  
  return data;
}

export async function updateUploadSession(uploadId: string, chunkIndex: number, totalChunks: number): Promise<boolean> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  // First get the current session
  const { data, error: getError } = await supabaseAdmin
    .from('upload_sessions')
    .select('chunks_received')
    .eq('upload_id', uploadId)
    .single();
    
  if (getError || !data) return false;
    
  // Ensure chunks_received is an array and make a copy
  const chunksReceived: number[] = Array.isArray(data.chunks_received) 
    ? [...data.chunks_received] 
    : [];
    
  // Add the chunk if not already present
  if (!chunksReceived.includes(chunkIndex)) {
    chunksReceived.push(chunkIndex);
  }
    
  // Update the session
  const { error: updateError } = await supabaseAdmin
    .from('upload_sessions')
    .update({
      chunks_received: chunksReceived,
      timestamp: Date.now() // Refresh timestamp
    })
    .eq('upload_id', uploadId);
    
  if (updateError) return false;
  
  // Check if we have all chunks - use length comparison but ALSO verify each chunk exists
  let allChunksPresent = chunksReceived.length === totalChunks;

  // If we think we have all chunks, verify each index exists
  if (allChunksPresent) {
    for (let i = 0; i < totalChunks; i++) {
      if (!chunksReceived.includes(i)) {
        console.log(`Missing chunk ${i} despite having ${chunksReceived.length} chunks`);
        allChunksPresent = false;
        break;
      }
    }
  }
  
  // Log chunk status
  console.log(`Chunks status for ${uploadId}: ${chunksReceived.length}/${totalChunks}, all present: ${allChunksPresent}`);
  if (chunksReceived.length > 0) {
    console.log(`Received chunks: ${chunksReceived.sort((a, b) => a - b).join(', ')}`);
  }
  
  return allChunksPresent;
}

export async function deleteUploadSession(uploadId: string): Promise<boolean> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  const { error } = await supabaseAdmin
    .from('upload_sessions')
    .delete()
    .eq('upload_id', uploadId);
    
  return !error;
}

// Optional: Add a function to clean up old sessions
export async function cleanupOldSessions(maxAgeInMs: number = 3600000): Promise<void> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  const cutoffTime = Date.now() - maxAgeInMs;
  
  await supabaseAdmin
    .from('upload_sessions')
    .delete()
    .lt('timestamp', cutoffTime);
}

