import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development mode' }, { status: 403 });
  }

  try {
    const dataPath = path.join(process.cwd(), 'src', 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    return NextResponse.json(data);
  } catch (e) {
    console.error('Fetch error:', e);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development mode' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const dataPath = path.join(process.cwd(), 'src', 'data.json');
    
    // 写入 formatted JSON
    fs.writeFileSync(dataPath, JSON.stringify(body, null, 2), 'utf8');

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Save error:', e);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
