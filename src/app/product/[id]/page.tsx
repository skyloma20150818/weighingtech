import { getProducts, getProductById, getRecommendations, getConsult } from '../../../lib/data-fetcher';
import ProductDetail from './ProductDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  const product = await getProductById(id);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">产品未找到</h1>
        </div>
      </div>
    );
  }

  const [recommendations, consult] = await Promise.all([
    getRecommendations(product.category, id),
    getConsult()
  ]);

  return (
    <ProductDetail 
      product={product as any} 
      consult={consult} 
      recommendations={recommendations as any[]} 
    />
  );
}
