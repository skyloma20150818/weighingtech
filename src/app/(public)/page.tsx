import { getAllPageData } from '../../lib/data-fetcher';
import HomeClient from '../../components/HomeClient';

// 禁用缓存，确保数据实时更新
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const initialData = await getAllPageData();
  
  return <HomeClient initialData={initialData as any} />;
}
