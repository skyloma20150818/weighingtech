// 管理后台共享类型定义

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
}

export interface ProductSpec {
  label: string;
  labelEn?: string;
  value: string;
}

export interface ProductDocument {
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  docType: string;
  format: string;
  fileSize?: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  code: string;
  category: string;
  description: string;
  descriptionEn?: string;
  image: string;
  specs: ProductSpec[];
  documents: ProductDocument[];
  has360?: boolean;
  images360Count?: number;
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

export interface Feature {
  icon: string;
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
}

export interface AboutConfig {
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  image?: string;
}

export interface ContactConfig {
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  addressEn?: string;
}

export interface ConsultConfig {
  title?: string;
  description?: string;
  wechat: { enabled: boolean; qrImage: string };
  qq: { enabled: boolean; qrImage: string };
}

export interface HeroConfig {
  videoUrl?: string;
  poster?: string;
}

export interface SectionConfig {
  title?: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
}

export interface SiteConfig {
  hero: HeroConfig;
  features: Feature[];
  about: AboutConfig;
  contact: ContactConfig;
  consult: ConsultConfig;
  sections: Record<string, SectionConfig>;
}

export interface AppData {
  products: Product[];
  categories: Category[];
  albumCategories: Category[];
  solutionCategories: Category[];
  companyAlbum: AlbumItem[];
  solutionVideos: VideoItem[];
  siteConfig?: SiteConfig;
  hero?: HeroConfig;
  contact?: ContactConfig;
  consult?: ConsultConfig;
}

export interface DocumentItem {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  docType: string;
  format: string;
  fileSize?: string;
  url: string;
  category: string;
  sort: number;
}
