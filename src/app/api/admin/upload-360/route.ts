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
    const productCode = formData.get('productCode') as string;
    const files = formData.getAll('files') as File[];

    if (!productCode) {
      return NextResponse.json({ error: 'productCode is required' }, { status: 400 });
    }

    const dirPath = path.join(process.cwd(), 'public', 'uploads', productCode, '360');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const savedFiles: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = file.name;
      fs.writeFileSync(path.join(dirPath, fileName), buffer);
      savedFiles.push(`/uploads/${productCode}/360/${fileName}`);
    }

    return NextResponse.json({ saved: savedFiles.length, files: savedFiles });
  } catch (e) {
    console.error('Upload 360 error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productCode, filename } = await request.json();
    if (!productCode || !filename) {
      return NextResponse.json({ error: 'productCode and filename required' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', productCode, '360', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Re-read and report updated count
    const dirPath = path.join(process.cwd(), 'public', 'uploads', productCode, '360');
    const remaining = fs.readdirSync(dirPath).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f)).length;

    return NextResponse.json({ success: true, remaining });
  } catch (e) {
    console.error('Delete 360 error:', e);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // GET remains accessible as it is used by the frontend to list assets,
  // but we can remove the development restriction to allow it in production.

  const { searchParams } = new URL(request.url);
  const productCode = searchParams.get('productCode');

  if (!productCode) {
    return NextResponse.json({ files: [] });
  }

  const dirPath = path.join(process.cwd(), 'public', 'uploads', productCode, '360');
  if (!fs.existsSync(dirPath)) {
    return NextResponse.json({ files: [] });
  }

  const files = fs.readdirSync(dirPath)
    .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.split('.')[0]);
      const numB = parseInt(b.split('.')[0]);
      return numA - numB;
    })
    .map(f => `/uploads/${productCode}/360/${f}`);

  return NextResponse.json({ files, count: files.length });
}
