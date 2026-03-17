import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { auth } from '../../../../auth';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      categories,
      albumCategories,
      solutionCategories,
      solutionVideos,
      companyAlbum,
      products,
      contact,
      consult,
      about,
      hero
    ] = await Promise.all([
      prisma.category.findMany(),
      prisma.albumCategory.findMany(),
      prisma.solutionCategory.findMany(),
      prisma.videoItem.findMany(),
      prisma.albumItem.findMany(),
      prisma.product.findMany({
        include: {
          specs: true,
          documents: true,
          introImages: true,
        },
      }),
      prisma.contact.findUnique({ where: { id: 1 } }),
      prisma.consult.findUnique({ where: { id: 1 } }),
      prisma.about.findUnique({ where: { id: 1 } }),
      prisma.hero.findUnique({ where: { id: 1 } }),
    ]);

    // Format consult back to the frontend expected format
    const formattedConsult = consult ? {
      title: consult.title,
      description: consult.description,
      wechat: {
        enabled: consult.wechatEnabled,
        label: consult.wechatLabel,
        qrImage: consult.wechatQrImage,
      },
      qq: {
        enabled: consult.qqEnabled,
        number: consult.qqNumber,
        label: consult.qqLabel,
        qrImage: consult.qqQrImage,
      },
    } : null;

    return NextResponse.json({
      categories,
      albumCategories,
      solutionCategories,
      solutionVideos,
      companyAlbum,
      products,
      contact,
      consult: formattedConsult,
      about,
      hero
    });
  } catch (e) {
    console.error('Fetch error:', e);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // In a real migration, we would upsert each item.
    // For simplicity in this "JSON mirror" editor, we'll implement a basic transaction.
    // NOTE: This editor seems to send the full state.
    
    await prisma.$transaction(async (tx) => {
      // Update Hero
      if (body.hero) {
        await tx.hero.upsert({
          where: { id: 1 },
          create: { ...body.hero, id: 1 },
          update: body.hero,
        });
      }

      // Update Contact
      if (body.contact) {
        await tx.contact.upsert({
          where: { id: 1 },
          create: { ...body.contact, id: 1 },
          update: body.contact,
        });
      }

      // Update About
      if (body.about) {
        await tx.about.upsert({
          where: { id: 1 },
          create: { ...body.about, id: 1 },
          update: body.about,
        });
      }

      // Update Consult (mapping back from nested structure)
      if (body.consult) {
        const c = body.consult;
        const consultData = {
          title: c.title,
          description: c.description,
          wechatEnabled: c.wechat?.enabled ?? false,
          wechatLabel: c.wechat?.label ?? '',
          wechatQrImage: c.wechat?.qrImage ?? '',
          qqEnabled: c.qq?.enabled ?? false,
          qqNumber: c.qq?.number ?? '',
          qqLabel: c.qq?.label ?? '',
          qqQrImage: c.qq?.qrImage ?? '',
        };
        await tx.consult.upsert({
          where: { id: 1 },
          create: { ...consultData, id: 1 },
          update: consultData,
        });
      }

      // For collections (products, categories, etc.), the simplest way to "mirror" the JSON write
      // while preserving IDs is to clear and re-insert, or upsert.
      // Given the editor's design, clearing and re-inserting is closer to its "replace file" behavior.
      
      if (body.categories) {
        await tx.category.deleteMany();
        await tx.category.createMany({ data: body.categories });
      }
      if (body.albumCategories) {
        await tx.albumCategory.deleteMany();
        await tx.albumCategory.createMany({ data: body.albumCategories });
      }
      if (body.solutionCategories) {
        await tx.solutionCategory.deleteMany();
        await tx.solutionCategory.createMany({ data: body.solutionCategories });
      }
      if (body.solutionVideos) {
        await tx.videoItem.deleteMany();
        await tx.videoItem.createMany({ data: body.solutionVideos });
      }
      if (body.companyAlbum) {
        await tx.albumItem.deleteMany();
        await tx.albumItem.createMany({ data: body.companyAlbum });
      }

      if (body.products) {
        // Products are complex because of nested specs and docs
        await tx.productDocument.deleteMany();
        await tx.productSpec.deleteMany();
        await tx.productImage.deleteMany();
        await tx.product.deleteMany();

        for (const p of body.products) {
          const { specs, documents, introImages, ...pData } = p;
          await tx.product.create({
            data: {
              ...pData,
              specs: {
                create: specs?.map((s: any) => ({
                  label: s.label,
                  labelEn: s.labelEn,
                  value: s.value,
                })) || [],
              },
              documents: {
                create: documents?.map((d: any) => ({
                  title: d.title,
                  titleEn: d.titleEn,
                  url: d.url,
                  format: d.format,
                  fileSize: d.fileSize,
                  docType: d.docType,
                  description: d.description,
                  descriptionEn: d.descriptionEn,
                })) || [],
              },
              introImages: {
                create: introImages?.map((img: string) => ({ url: img })) || [],
              }
            }
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Save error:', e);
    return NextResponse.json({ error: 'Failed to save data: ' + e.message }, { status: 500 });
  }
}
