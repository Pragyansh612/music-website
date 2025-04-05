import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const driveUrl = url.searchParams.get('url');
  
  if (!driveUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }
  
  try {
    // Extract file ID from Google Drive link
    const fileId = extractGoogleDriveFileId(driveUrl);
    if (!fileId) {
      return new NextResponse('Invalid Google Drive URL', { status: 400 });
    }
    
    // Use the direct download link format
    const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    // Fetch the file and stream it to the client
    const response = await fetch(directDownloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    
    // Extract filename from headers or use a default
    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'download.zip';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    
    // Return the response with appropriate headers
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': response.headers.get('content-length') || '',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Failed to download file', { status: 500 });
  }
}

// Helper function to extract file ID from Google Drive links
function extractGoogleDriveFileId(url: string): string | null {
  // Handle various Google Drive URL formats
  const patterns = [
    /drive\.google\.com\/file\/d\/([^\/]+)/,      // Format: drive.google.com/file/d/{fileId}/...
    /drive\.google\.com\/open\?id=([^&]+)/,       // Format: drive.google.com/open?id={fileId}
    /drive\.google\.com\/uc\?export=download&id=([^&]+)/, // Format: direct download link
    /drive\.google\.com\/drive\/u\/\d+\/open\?id=([^&]+)/ // Format: drive.google.com/drive/u/0/open?id={fileId}
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}