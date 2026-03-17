'use server';

import fs from 'fs';
import path from 'path';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';

export async function uploadFile(formData: FormData): Promise<{ url?: string; error?: string }> {
  const session = await auth();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'others';

    if (!file) {
      return { error: 'No file uploaded' };
    }

    // 50MB limit
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { error: '文件过大，最大支持 50MB' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 确保目录存在
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 处理文件名
    const fileName = file.name.replace(/\s+/g, '-');
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicPath = `/uploads/${category}/${fileName}`;
    return { url: publicPath };
  } catch (e: any) {
    console.error('Upload error:', e);
    return { error: 'Upload failed: ' + e.message };
  }
}
