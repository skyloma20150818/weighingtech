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
      siteConfig
    ] = await Promise.all([
      prisma.category.findMany(),
      prisma.albumCategory.findMany(),
      prisma.solutionCategory.findMany(),
      prisma.videoItem.findMany(),
      prisma.albumItem.findMany(),
      prisma.product.findMany({
        include: {
          documents: true,
          introImages: true,
        },
      }),
      prisma.siteConfig.findUnique({ where: { id: 1 } }),
    ]);

    // Parse JSON fields from siteConfig
    const parse = (val: any) => typeof val === 'string' ? JSON.parse(val) : val;

    return NextResponse.json({
      categories,
      albumCategories,
      solutionCategories,
      solutionVideos,
      companyAlbum,
      products: products.map(p => ({
        ...p,
        specs: parse(p.specs)
      })),
      siteConfig: siteConfig ? {
        hero: parse(siteConfig.hero),
        features: parse(siteConfig.features),
        about: parse(siteConfig.about),
        contact: parse(siteConfig.contact),
        consult: parse(siteConfig.consult),
        sections: parse(siteConfig.sections),
      } : null
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
    
    await prisma.$transaction(async (tx) => {
      // Update Consolidated Site Config
      if (body.siteConfig) {
        await tx.siteConfig.upsert({
          where: { id: 1 },
          create: {
            id: 1,
            hero: body.siteConfig.hero,
            features: body.siteConfig.features,
            about: body.siteConfig.about,
            contact: body.siteConfig.contact,
            consult: body.siteConfig.consult,
            sections: body.siteConfig.sections,
          },
          update: {
            hero: body.siteConfig.hero,
            features: body.siteConfig.features,
            about: body.siteConfig.about,
            contact: body.siteConfig.contact,
            consult: body.siteConfig.consult,
            sections: body.siteConfig.sections,
          },
        });
      }

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
        await tx.productDocument.deleteMany();
        await tx.productImage.deleteMany();
        await tx.product.deleteMany();

        for (const p of body.products) {
          const { specs, documents, introImages, ...pData } = p;
          await tx.product.create({
            data: {
              ...pData,
              specs: specs || null, // Store as native Json
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
