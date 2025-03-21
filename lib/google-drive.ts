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
// Add this to google-drive.ts
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
    
    // Make the file publicly accessible with link
    await googleDrive.permissions.create({
      fileId: response.data.id as string,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });
    
    return {
      id: response.data.id,
      link: response.data.webViewLink
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};