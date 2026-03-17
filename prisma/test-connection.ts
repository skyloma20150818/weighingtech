// Test database connection
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('测试数据库连接...\n');

  try {
    // 测试连接
    await prisma.$connect();
    console.log('✓ 数据库连接成功！\n');

    // 测试查询各表
    const adminCount = await prisma.adminUser.count();
    console.log(`AdminUser 表: ${adminCount} 条记录`);

    const categoryCount = await prisma.category.count();
    console.log(`Category 表: ${categoryCount} 条记录`);

    const productCount = await prisma.product.count();
    console.log(`Product 表: ${productCount} 条记录`);

    const albumCategoryCount = await prisma.albumCategory.count();
    console.log(`AlbumCategory 表: ${albumCategoryCount} 条记录`);

    const albumItemCount = await prisma.albumItem.count();
    console.log(`AlbumItem 表: ${albumItemCount} 条记录`);

    const videoCount = await prisma.videoItem.count();
    console.log(`VideoItem 表: ${videoCount} 条记录`);

    const solutionCategoryCount = await prisma.solutionCategory.count();
    console.log(`SolutionCategory 表: ${solutionCategoryCount} 条记录`);

    const contactCount = await prisma.contact.count();
    console.log(`Contact 表: ${contactCount} 条记录`);

    const consultCount = await prisma.consult.count();
    console.log(`Consult 表: ${consultCount} 条记录`);

    const aboutCount = await prisma.about.count();
    console.log(`About 表: ${aboutCount} 条记录`);

    const heroCount = await prisma.hero.count();
    console.log(`Hero 表: ${heroCount} 条记录`);

    console.log('\n✓ 所有表查询成功！');

  } catch (error) {
    console.error('✗ 数据库连接失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
