import { NextRequest, NextResponse } from 'next/server';

// Create a global variable to store upload sessions
declare global {
  var uploadSessions: Map<string, {
    fileName: string,
    fileType: string,
    parentFolderId: string,
    chunks: Buffer[],
    timestamp: number,
  }>;
  var sessionCleanupInterval: NodeJS.Timeout;
}

// Initialize the global map if it doesn't exist
if (!global.uploadSessions) {
  global.uploadSessions = new Map();
  console.log("Initialized global upload sessions map");
}

export const uploadSessions = global.uploadSessions;