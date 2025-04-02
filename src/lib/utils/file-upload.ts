import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import sharp from 'sharp';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Generate a unique filename with the original extension
export function generateUniqueFilename(originalFilename: string): string {
  const ext = path.extname(originalFilename).toLowerCase();
  const uuid = randomUUID();
  return `${uuid}${ext}`;
}

// Process and save an uploaded image
export async function saveUploadedImage(formData: FormData, fieldName: string): Promise<{
  success: boolean;
  fileUrl?: string;
  filename?: string;
  fileSize?: number;
  contentType?: string;
  error?: string;
}> {
  try {
    const file = formData.get(fieldName) as File;
    
    // Check if file exists
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: `File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB` };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
    }

    // Generate unique filename and prepare full path
    const uniqueFilename = generateUniqueFilename(file.name);
    const fullPath = path.join(UPLOAD_DIR, uniqueFilename);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process with sharp to optimize and validate image
    await sharp(buffer)
      .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .toFile(fullPath);

    // Calculate relative URL (assuming uploads are served from /uploads)
    const relativeUrl = `/uploads/${uniqueFilename}`;

    return {
      success: true,
      fileUrl: relativeUrl,
      filename: uniqueFilename,
      fileSize: file.size,
      contentType: file.type
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error during file upload' 
    };
  }
} 