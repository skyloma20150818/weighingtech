import data from './data.json';

export interface Category {
  id: string;
  name: string;
  nameEn: string;
}

export interface ProductSpec {
  label: string;
  labelEn: string;
  value: string;
}

export interface ProductDocument {
  title: string;
  titleEn: string;
  description?: string;
  descriptionEn?: string;
  docType: string;  // e.g. '使用说明书' | '驱动程序' | 'CAD图纸' | '产品规格书' | '安装手册' | '其他'
  format: string;  // file extension: PDF, ZIP, DXF, EXE, etc.
  fileSize?: string;
  url: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  category: string;
  description: string;
  descriptionEn?: string;
  image: string;
  has360?: boolean;
  images360Count?: number;
  introImages?: string[];
  specs?: ProductSpec[];
  documents?: ProductDocument[];
}

export interface AlbumItem {
  id: string;
  title: string;
  titleEn?: string;
  category: string;
  image: string;
}

export interface VideoItem {
  id: string;
  title: string;
  titleEn?: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
}

export interface Contact {
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
}

export interface Consult {
  title?: string;
  description?: string;
  wechat?: {
    enabled?: boolean;
    label?: string;
    qrImage?: string;
  };
  qq?: {
    enabled?: boolean;
    number?: string;
    label?: string;
    qrImage?: string;
  };
}

export interface About {
  description?: string;
  descriptionEn?: string;
}

export interface Hero {
  videoUrl: string;
  poster?: string;
}

export const categories = data.categories as Category[];
export const albumCategories = data.albumCategories as Category[];
export const solutionCategories = data.solutionCategories as Category[];
export const solutionVideos = data.solutionVideos as VideoItem[];
export const companyAlbum = data.companyAlbum as AlbumItem[];
export const products = data.products as Product[];
export const contact = data.contact as Contact | undefined;
export const consult = data.consult as Consult | undefined;
export const about = data.about as About | undefined;
export const hero = data.hero as Hero | undefined;
