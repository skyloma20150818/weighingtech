import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { auth } from '../../../../auth';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'others';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
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
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
