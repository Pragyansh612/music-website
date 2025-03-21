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
export const uploadFile = async (file: File, fileName: string, folderId: string) => {
  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create a readable stream from buffer
    const readable = Readable.from(buffer);
    
    const response = await googleDrive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId]
      },
      media: {
        mimeType: file.type || 'application/octet-stream',
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