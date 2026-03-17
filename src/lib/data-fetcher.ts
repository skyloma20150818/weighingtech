import { unstable_cache } from 'next/cache';
import prisma from './prisma';

// Re-using types where possible or mapping from Prisma
export const getCategories = unstable_cache(
  async () => await prisma.category.findMany(),
  ['categories'],
  { revalidate: 3600 }
);

export const getAlbumCategories = unstable_cache(
  async () => await prisma.albumCategory.findMany(),
  ['albumCategories'],
  { revalidate: 3600 }
);

export const getSolutionCategories = unstable_cache(
  async () => await prisma.solutionCategory.findMany(),
  ['solutionCategories'],
  { revalidate: 3600 }
);

export const getSolutionVideos = unstable_cache(
  async () => await prisma.videoItem.findMany(),
  ['solutionVideos'],
  { revalidate: 3600 }
);

export const getCompanyAlbum = unstable_cache(
  async () => await prisma.albumItem.findMany(),
  ['companyAlbum'],
  { revalidate: 3600 }
);

export const getProducts = unstable_cache(
  async () => {
    const data = await prisma.product.findMany({
      include: {
        specs: true,
        documents: true,
        introImages: true,
      },
    });
    return data.map(p => ({
      ...p,
      introImages: p.introImages.map(img => img.url),
    }));
  },
  ['products'],
  { revalidate: 3600 }
);

export const getProductById = unstable_cache(
  async (id: string) => {
    const p = await prisma.product.findUnique({
      where: { id },
      include: {
        specs: true,
        documents: true,
        introImages: true,
      },
    });
    if (!p) return null;
    return {
      ...p,
      introImages: p.introImages.map(img => img.url),
    };
  },
  ['product-detail'],
  { revalidate: 3600 }
);

export const getRecommendations = async (categoryId: string, excludeId: string) => {
  const data = await prisma.product.findMany({
    where: {
      category: categoryId,
      id: { not: excludeId },
    },
    take: 4,
  });
  return data;
};

export const getContact = unstable_cache(
  async () => await prisma.contact.findUnique({ where: { id: 1 } }),
  ['contact'],
  { revalidate: 3600 }
);

export const getConsult = unstable_cache(
  async () => {
    const data = await prisma.consult.findUnique({ where: { id: 1 } });
    if (!data) return null;
    return {
      title: data.title,
      description: data.description,
      wechat: {
        enabled: data.wechatEnabled,
        label: data.wechatLabel,
        qrImage: data.wechatQrImage,
      },
      qq: {
        enabled: data.qqEnabled,
        number: data.qqNumber,
        label: data.qqLabel,
        qrImage: data.qqQrImage,
      },
    };
  },
  ['consult'],
  { revalidate: 3600 }
);

export const getAbout = unstable_cache(
  async () => await prisma.about.findUnique({ where: { id: 1 } }),
  ['about'],
  { revalidate: 3600 }
);

export const getHero = unstable_cache(
  async () => await prisma.hero.findUnique({ where: { id: 1 } }),
  ['hero'],
  { revalidate: 3600 }
);

export const getAllPageData = async () => {
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
    getCategories(),
    getAlbumCategories(),
    getSolutionCategories(),
    getSolutionVideos(),
    getCompanyAlbum(),
    getProducts(),
    getContact(),
    getConsult(),
    getAbout(),
    getHero()
  ]);

  return {
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
  };
};
