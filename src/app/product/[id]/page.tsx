import { use } from 'react';
import { products } from '../../../data';
import ProductDetail from './ProductDetail';

// 生成静态路由（静态导出需要）- 服务端函数
export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const { id } = use(params);

  const product = products.find(p => p.id === id);

  return <ProductDetail product={product} productId={id} />;
}
