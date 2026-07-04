"use server";

import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;

  if (!file) {
    throw new Error("No file uploaded");
  }

  // Validate File Type (e.g., only images)
  if (!file.type.startsWith('image/')) {
    throw new Error("Only image files are allowed");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Define path: public/uploads/[filename]
  // In production, you'd likely use an S3 bucket or similar
  const path = join(process.cwd(), 'public/uploads', file.name);
  
  await writeFile(path, buffer);
  
  return { success: true, url: `/uploads/${file.name}` };
}