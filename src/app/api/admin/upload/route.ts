import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { auth } from '../../../../auth';

// 配置最大 body 大小为 50MB
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const maxDuration = 60; // Vercel Serverless: 最多 60 秒

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 检查 content-type
    const contentType = request.headers.get('content-type') || '';

    // 对于大文件，使用 stream 处理
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const category = formData.get('category') as string || 'others';

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      // 检查文件大小 (50MB 限制)
      const MAX_SIZE = 50 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: '文件过大，最大支持 50MB' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 确保目录存在
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // 处理文件名（避免特殊字符和重名）
      const fileName = file.name.replace(/\s+/g, '-');
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      const publicPath = `/uploads/${category}/${fileName}`;
      return NextResponse.json({ url: publicPath });
    }

    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  } catch (e: any) {
    console.error('Upload error:', e);
    if (e.message?.includes('body exceeded')) {
      return NextResponse.json({ error: '文件过大，最大支持 50MB' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Upload failed: ' + e.message }, { status: 500 });
  }
}
