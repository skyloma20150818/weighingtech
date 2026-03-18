/**
 * 下载中心迁移脚本
 *
 * 使用方法:
 * 1. 将原网站的下载文件放到 scripts/downloads 目录
 * 2. 运行: npx tsx prisma/migrate-downloads.ts
 *
 * 或者使用爬虫模式:
 * 2. 运行: npx tsx prisma/migrate-downloads.ts --crawl
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const prisma = new PrismaClient();

// 文档类型映射
const DOC_TYPE_MAP: Record<string, string> = {
  '使用说明书': '使用说明书',
  '说明书': '使用说明书',
  'manual': '使用说明书',
  '安装手册': '安装手册',
  '安装说明': '安装手册',
  'installation': '安装手册',
  '驱动程序': '驱动程序',
  '驱动': '驱动程序',
  'driver': '驱动程序',
  'CAD图纸': 'CAD图纸',
  'CAD': 'CAD图纸',
  '产品规格书': '产品规格书',
  '规格书': '产品规格书',
  'spec': '产品规格书',
  '维护手册': '维护手册',
  '维护': '维护手册',
  'maintenance': '维护手册',
  '其他': '其他',
};

// 格式化映射
const FORMAT_MAP: Record<string, string> = {
  'pdf': 'PDF',
  'zip': 'ZIP',
  'dxf': 'DXF',
  'exe': 'EXE',
  'doc': 'DOC',
  'docx': 'DOC',
  'step': 'STEP',
  'iges': 'IGES',
  'stp': 'STEP',
};

interface DownloadFile {
  productCode: string;
  title: string;
  titleEn?: string;
  docType: string;
  format: string;
  url: string;
  description?: string;
  descriptionEn?: string;
}

// 手动配置的文件列表（你需要填写）
const MANUAL_FILES: DownloadFile[] = [
  // 示例格式：
  // {
  //   productCode: 'T980',
  //   title: 'T980使用说明书',
  //   titleEn: 'T980 User Manual',
  //   docType: '使用说明书',
  //   format: 'PDF',
  //   url: 'https://weighingtech.com/downloads/T980_manual.pdf',
  // },
];

async function downloadFile(url: string, destPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;

    console.log(`  下载: ${url}`);

    const file = fs.createWriteStream(destPath);
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 处理重定向
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          fs.unlinkSync(destPath);
          downloadFile(redirectUrl, destPath).then(resolve);
          return;
        }
      }

      if (response.statusCode !== 200) {
        console.log(`  ❌ 失败: HTTP ${response.statusCode}`);
        file.close();
        fs.unlinkSync(destPath);
        resolve(false);
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(destPath);
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`  ✅ 完成 (${sizeMB} MB)`);
        resolve(true);
      });
    }).on('error', (err) => {
      console.log(`  ❌ 错误: ${err.message}`);
      file.close();
      if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
      }
      resolve(false);
    });
  });
}

function getFileSize(url: string): Promise<string> {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.head(url, (response) => {
      if (response && response.headers['content-length']) {
        const bytes = parseInt(response.headers['content-length']);
        if (bytes < 1024) resolve(`${bytes} B`);
        else if (bytes < 1024 * 1024) resolve(`${(bytes / 1024).toFixed(1)} KB`);
        else resolve(`${(bytes / 1024 / 1024).toFixed(1)} MB`);
      } else {
        resolve('未知');
      }
    }).on('error', () => resolve('未知'));
  });
}

function guessDocType(filename: string): string {
  const lower = filename.toLowerCase();
  for (const [key, value] of Object.entries(DOC_TYPE_MAP)) {
    if (lower.includes(key.toLowerCase())) return value;
  }
  return '其他';
}

function guessFormat(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return FORMAT_MAP[ext] || ext.toUpperCase();
}

async function processFiles(files: DownloadFile[]) {
  const documentsDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
  if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir, { recursive: true });
  }

  console.log(`\n📁 文档目录: ${documentsDir}`);
  console.log(`📄 待处理: ${files.length} 个文件\n`);

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    console.log(`\n处理: ${file.title} (${file.productCode})`);

    // 生成文件名
    const filename = `${file.productCode}_${file.title}.${file.format.toLowerCase()}`;
    const destPath = path.join(documentsDir, filename);
    const publicPath = `/uploads/documents/${filename}`;

    // 下载文件
    let downloaded = false;
    if (file.url.startsWith('http')) {
      downloaded = await downloadFile(file.url, destPath);
    } else if (fs.existsSync(file.url)) {
      // 本地文件直接复制
      fs.copyFileSync(file.url, destPath);
      downloaded = true;
      console.log('  ✅ 已从本地复制');
    }

    if (!downloaded) {
      failCount++;
      continue;
    }

    // 获取文件大小
    let fileSize = '';
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size < 1024) fileSize = `${stats.size} B`;
      else if (stats.size < 1024 * 1024) fileSize = `${(stats.size / 1024).toFixed(1)} KB`;
      else fileSize = `${(stats.size / 1024 / 1024).toFixed(1)} MB`;
    }

    // 查找产品
    const product = await prisma.product.findFirst({
      where: { code: file.productCode },
    });

    if (!product) {
      console.log(`  ⚠️  产品未找到: ${file.productCode}`);
      fs.unlinkSync(destPath);
      failCount++;
      continue;
    }

    // 创建文档记录
    await prisma.productDocument.create({
      data: {
        productId: product.id,
        title: file.title,
        titleEn: file.titleEn || '',
        description: file.description || '',
        descriptionEn: file.descriptionEn || '',
        docType: file.docType,
        format: file.format,
        fileSize: fileSize || '未知',
        url: publicPath,
      },
    });

    console.log(`  ✅ 已添加到产品: ${product.name}`);
    successCount++;
  }

  console.log(`\n========== 完成 ==========`);
  console.log(`成功: ${successCount}`);
  console.log(`失败: ${failCount}`);
}

async function main() {
  console.log('======================================');
  console.log('   下载中心迁移工具');
  console.log('======================================\n');

  // 检查是否有手动配置的文件
  if (MANUAL_FILES.length > 0) {
    console.log('📋 使用手动配置的文件列表\n');
    await processFiles(MANUAL_FILES);
  } else {
    // 扫描本地文件
    const downloadsDir = path.join(process.cwd(), 'scripts', 'downloads');

    if (!fs.existsSync(downloadsDir)) {
      console.log('❌ 未找到 scripts/downloads 目录');
      console.log('\n请选择操作:');
      console.log('1. 在 scripts/downloads 目录放入手动下载的文件');
      console.log('2. 在脚本中配置 MANUAL_FILES 数组');
      console.log('\n文件命名格式: 产品编码_文档类型.扩展名');
      console.log('例如: T980_使用说明书.pdf\n');
      return;
    }

    console.log(`📂 扫描目录: ${downloadsDir}\n`);

    const files = fs.readdirSync(downloadsDir);
    const processableFiles: DownloadFile[] = [];

    for (const filename of files) {
      // 解析文件名: 产品编码_文档类型.扩展名
      const match = filename.match(/^(.+?)_(.+)\.(.+)$/);
      if (match) {
        const [, productCode, docTypeWithFormat, ext] = match;

        // 分离文档类型和格式
        let docType = guessDocType(docTypeWithFormat);
        let format = FORMAT_MAP[ext] || ext.toUpperCase();

        // 如果无法识别，尝试从文件名推断
        if (docType === '其他') {
          docType = guessDocType(docTypeWithFormat);
        }

        processableFiles.push({
          productCode,
          title: docTypeWithFormat,
          docType,
          format,
          url: path.join(downloadsDir, filename),
        });
      }
    }

    console.log(`找到 ${processableFiles.length} 个文件\n`);

    if (processableFiles.length === 0) {
      console.log('❌ 未找到可处理的文件');
      console.log('\n文件命名格式: 产品编码_文档类型.扩展名');
      console.log('例如: T980_使用说明书.pdf');
      return;
    }

    await processFiles(processableFiles);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
