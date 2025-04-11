import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { Readable } from 'stream';

// Initialize the Google Drive API client
const initGoogleDriveClient = () => {
  const credentials = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS || '{}');
  
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/drive']
  });
  
  return google.drive({ version: 'v3', auth });
};

export const googleDrive = initGoogleDriveClient();

// Main folder ID where all kits will be stored
export const MAIN_FOLDER_ID = '1yRCtRAXTLfWQFyfFeshJgiRJKV5E8FIw';

// Upload a file to Google Drive
export const uploadFile = async (file: any, fileName: string, folderId: string) => {
  try {
    // Handle both File objects and our custom chunk-combined objects
    let buffer;
    let mimeType;
    
    if (file instanceof File) {
      // Original File object case
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      mimeType = file.type || 'application/octet-stream';
    } else {
      // Our custom object from chunks
      buffer = Buffer.from(await file.arrayBuffer());
      mimeType = file.type || 'application/octet-stream';
    }
    
    // Create a readable stream from buffer
    const readable = Readable.from(buffer);
    
    console.log(`Starting Google Drive upload for ${fileName} (${buffer.length} bytes)`);
    
    const response = await googleDrive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId]
      },
      media: {
        mimeType: mimeType,
        body: readable
      },
      fields: 'id,webViewLink'
    });
    
    console.log(`File uploaded to Google Drive: ${fileName}, ID: ${response.data.id}`);
    
    // Make the file publicly accessible with link
    await googleDrive.permissions.create({
      fileId: response.data.id as string,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });
    
    console.log(`File permissions set to public: ${response.data.id}`);
    
    return {
      id: response.data.id,
      link: response.data.webViewLink
    };
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
};

// Add a utility function to update file record after background processing
export const updateFileRecord = async (supabase: any, kitId: string, fileName: string, fileId: string, webViewLink: string) => {
  try {
    // Find the placeholder record
    const { data, error: findError } = await supabase
      .from('kit_files')
      .select()
      .eq('kit_id', kitId)
      .eq('file_name', fileName)
      .single();
    
    if (findError || !data) {
      console.error(`Failed to find placeholder record for ${fileName} in kit ${kitId}:`, findError);
      return false;
    }
    
    // Update the record with actual Google Drive info
    const { error: updateError } = await supabase
      .from('kit_files')
      .update({
        google_drive_link: webViewLink,
        google_drive_file_id: fileId
      })
      .eq('id', data.id);
    
    if (updateError) {
      console.error(`Failed to update record for ${fileName}:`, updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating file record for ${fileName}:`, error);
    return false;
  }
};