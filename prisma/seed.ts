import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(process.cwd(), 'src', 'data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log('开始迁移数据到 SQLite...');

  // 1. 创建管理用户
  const hashedPassword = await bcrypt.hash('admin123', 10); // 默认密码
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });
  console.log('✓ 管理用户已就绪 (admin/admin123)');

  // 2. 迁移 Categories
  if (data.categories) {
    for (const cat of data.categories) {
      await prisma.category.upsert({
        where: { id: cat.id },
        update: { name: cat.name, nameEn: cat.nameEn },
        create: { id: cat.id, name: cat.name, nameEn: cat.nameEn },
      });
    }
    console.log(`✓ 迁移了 ${data.categories.length} 个产品分类`);
  }

  // 3. 迁移 AlbumCategories
  if (data.albumCategories) {
    for (const cat of data.albumCategories) {
      await prisma.albumCategory.upsert({
        where: { id: cat.id },
        update: { name: cat.name, nameEn: cat.nameEn },
        create: { id: cat.id, name: cat.name, nameEn: cat.nameEn },
      });
    }
    console.log(`✓ 迁移了 ${data.albumCategories.length} 个相册分类`);
  }

  // 4. 迁移 SolutionCategories
  if (data.solutionCategories) {
    for (const cat of data.solutionCategories) {
      await prisma.solutionCategory.upsert({
        where: { id: cat.id },
        update: { name: cat.name, nameEn: cat.nameEn },
        create: { id: cat.id, name: cat.name, nameEn: cat.nameEn },
      });
    }
    console.log(`✓ 迁移了 ${data.solutionCategories.length} 个解决方案分类`);
  }

  // 5. 迁移 SolutionVideos
  if (data.solutionVideos) {
    for (const video of data.solutionVideos) {
      await prisma.videoItem.upsert({
        where: { id: video.id },
        update: { ...video },
        create: { ...video },
      });
    }
    console.log(`✓ 迁移了 ${data.solutionVideos.length} 个解决方案视频`);
  }

  // 6. 迁移 CompanyAlbum
  if (data.companyAlbum) {
    for (const item of data.companyAlbum) {
      await prisma.albumItem.upsert({
        where: { id: item.id },
        update: { ...item },
        create: { ...item },
      });
    }
    console.log(`✓ 迁移了 ${data.companyAlbum.length} 个公司相册记录`);
  }

  // 7. 迁移 Products (包含 specs, documents)
  if (data.products) {
    for (const p of data.products) {
      const { specs, documents, ...rest } = p;
      
      // Upsert Product
      await prisma.product.upsert({
        where: { id: p.id },
        update: { 
          ...rest,
          // 如果有 introImages，目前 schema 还没定好 introImages 的处理，这里先不传
        },
        create: {
          ...rest,
        },
      });

      // 迁移 Specs
      if (specs && Array.isArray(specs) && specs.length > 0) {
        // 先删除旧的
        await prisma.productSpec.deleteMany({ where: { productId: p.id } });
        for (const spec of specs) {
          await prisma.productSpec.create({
            data: {
              ...spec,
              productId: p.id,
            },
          });
        }
      }

      // 迁移 Documents
      if (documents && Array.isArray(documents) && documents.length > 0) {
        // 先删除旧的
        await prisma.productDocument.deleteMany({ where: { productId: p.id } });
        for (const doc of documents) {
          await prisma.productDocument.create({
            data: {
              ...doc,
              productId: p.id,
            },
          });
        }
      }
    }
    console.log(`✓ 迁移了 ${data.products.length} 个产品`);
  }

  // 8. 迁移 Contact
  if (data.contact) {
    await prisma.contact.upsert({
      where: { id: 1 },
      update: { ...data.contact },
      create: { id: 1, ...data.contact },
    });
    console.log('✓ 迁移了联系信息');
  }

  // 9. 迁移 Consult
  if (data.consult) {
    const { wechat, qq, ...rest } = data.consult;
    const consultData = {
      ...rest,
      wechatEnabled: wechat?.enabled,
      wechatLabel: wechat?.label,
      wechatQrImage: wechat?.qrImage,
      qqEnabled: qq?.enabled,
      qqNumber: qq?.number,
      qqLabel: qq?.label,
      qqQrImage: qq?.qrImage,
    };
    await prisma.consult.upsert({
      where: { id: 1 },
      update: consultData,
      create: { id: 1, ...consultData },
    });
    console.log('✓ 迁移了咨询信息');
  }

  // 10. 迁移 About
  if (data.about) {
    await prisma.about.upsert({
      where: { id: 1 },
      update: { ...data.about },
      create: { id: 1, ...data.about },
    });
    console.log('✓ 迁移了关于我们信息');
  }

  // 11. 迁移 Hero
  if (data.hero) {
    await prisma.hero.upsert({
      where: { id: 1 },
      update: { ...data.hero },
      create: { id: 1, ...data.hero },
    });
    console.log('✓ 迁移了 Hero 视频信息');
  }

  console.log('\n✓ 数据迁移完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
