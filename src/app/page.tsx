import { getAllPageData } from '../lib/data-fetcher';
import HomeClient from '../components/HomeClient';

export default async function Page() {
  const initialData = await getAllPageData();
  
  // Mapping Prisma results to the format expected by HomeClient if necessary
  // (In this case, the data-fetcher already handles most of it)
  
  return <HomeClient initialData={initialData as any} />;
}
