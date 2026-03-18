import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { auth } from '../../../../auth';

export async function GET() {
  try {
    const docs = await prisma.document.findMany({
      orderBy: { sort: 'asc' },
    });
    return NextResponse.json({ documents: docs });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const doc = await prisma.document.create({
      data: {
        title: body.title,
        titleEn: body.titleEn || '',
        description: body.description || '',
        descriptionEn: body.descriptionEn || '',
        docType: body.docType || '其他',
        format: body.format,
        fileSize: body.fileSize || '',
        url: body.url,
        category: body.category || 'other',
        sort: body.sort || 0,
      },
    });
    return NextResponse.json({ success: true, document: doc });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const doc = await prisma.document.update({
      where: { id: body.id },
      data: {
        title: body.title,
        titleEn: body.titleEn || '',
        description: body.description || '',
        descriptionEn: body.descriptionEn || '',
        docType: body.docType || '其他',
        format: body.format,
        fileSize: body.fileSize || '',
        url: body.url,
        category: body.category || 'other',
        sort: body.sort || 0,
      },
    });
    return NextResponse.json({ success: true, document: doc });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    await prisma.document.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
