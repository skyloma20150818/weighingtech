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
        documents: true,
        introImages: true,
      },
    });
    return data.map(p => ({
      ...p,
      introImages: p.introImages.map(img => img.url),
      specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs,
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
        documents: true,
        introImages: true,
      },
    });
    if (!p) return null;
    return {
      ...p,
      introImages: p.introImages.map(img => img.url),
      specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs,
    };
  },
  ['product-detail'],
  { revalidate: 3600 }
);

export const getSiteConfig = unstable_cache(
  async () => {
    const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
    if (!config) return null;
    
    // Parse JSON fields if they are returned as strings (Prisma sometimes does this for SQLite Json)
    const parse = (val: any) => typeof val === 'string' ? JSON.parse(val) : val;
    
    return {
      hero: parse(config.hero),
      features: parse(config.features),
      about: parse(config.about),
      contact: parse(config.contact),
      consult: parse(config.consult),
      sections: parse(config.sections),
    };
  },
  ['site-config'],
  { revalidate: 3600 }
);

export const getContact = async () => {
  const config = await getSiteConfig();
  return config?.contact || null;
};

export const getConsult = async () => {
  const config = await getSiteConfig();
  return config?.consult || null;
};

export const getRecommendations = async (productId: string, limit = 4) => {
  const allProducts = await getProducts();
  return allProducts
    .filter(p => p.id !== productId)
    .slice(0, limit);
};

export const getAllPageData = async () => {
  const [
    categories,
    albumCategories,
    solutionCategories,
    solutionVideos,
    companyAlbum,
    products,
    siteConfig
  ] = await Promise.all([
    getCategories(),
    getAlbumCategories(),
    getSolutionCategories(),
    getSolutionVideos(),
    getCompanyAlbum(),
    getProducts(),
    getSiteConfig()
  ]);

  return {
    categories,
    albumCategories,
    solutionCategories,
    solutionVideos,
    companyAlbum,
    products,
    ...siteConfig
  };
};
