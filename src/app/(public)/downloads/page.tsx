import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import DownloadsClient from './DownloadsClient';

export const metadata: Metadata = {
  title: '下载中心 - 唯英科技',
  description: '下载产品手册、技术资料和资质证书',
};

// 获取文档数据
async function getDocuments() {
  try {
    const docs = await prisma.document.findMany({
      orderBy: { sort: 'asc' },
    });
    return docs;
  } catch (e) {
    console.error('Failed to fetch documents:', e);
    return [];
  }
}

// 获取产品文档
async function getProductDocuments() {
  try {
    const products = await prisma.product.findMany({
      include: {
        documents: true,
      },
    });
    return products.filter(p => p.documents.length > 0);
  } catch (e) {
    console.error('Failed to fetch product documents:', e);
    return [];
  }
}

export default async function DownloadsPage() {
  const documents = await getDocuments();
  const productDocs = await getProductDocuments();

  return (
    <DownloadsClient 
      documents={documents} 
      productDocs={productDocs}
    />
  );
}
