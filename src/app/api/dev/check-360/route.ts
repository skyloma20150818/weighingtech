import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ exists: false, count: 0 });
  }

  const dirPath = path.join(process.cwd(), 'public', '360', code);

  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      // 过滤出图片文件 (1.png, 2.png ...)
      const imageFiles = files.filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
      return NextResponse.json({ 
        exists: imageFiles.length > 0, 
        count: imageFiles.length 
      });
    }
  } catch (e) {
    console.error('Error checking 360 dir:', e);
  }

  return NextResponse.json({ exists: false, count: 0 });
}
