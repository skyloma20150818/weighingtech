const fs = require('fs');
const path = require('path');

const srcDir = 'I:\\weighingtech_src\\公司简介及资质';
const targetBase = 'I:\\weighingtech_src\\next-app\\public\\uploads\\album';
const dataFile = 'I:\\weighingtech_src\\next-app\\src\\data.json';

// 读取现有数据
const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

// 资质图片 (资质-1.jpg 到 资质-12.jpg)
const files = [];
for (let i = 1; i <= 12; i++) {
  files.push({
    src: `资质-${i}.jpg`,
    title: `资质证书 ${i}`,
    titleEn: `Certificate ${i}`,
    category: 'certifications'
  });
}

// 文档文件
files.push({
  src: '公司简介及资质.pdf',
  title: '公司简介及资质',
  titleEn: 'Company Profile & Certifications',
  category: 'certifications',
  isDoc: true
});

console.log('Found files:', files.length);

// 创建目标目录
if (!fs.existsSync(targetBase)) {
  fs.mkdirSync(targetBase, { recursive: true });
}

let processed = 0;
files.forEach(file => {
  const srcPath = path.join(srcDir, file.src);
  if (!fs.existsSync(srcPath)) {
    console.log('Skip: not found', file.src);
    return;
  }

  const ext = path.extname(file.src);
  const newName = file.title + ext;
  const targetPath = path.join(targetBase, newName);

  // 复制文件
  fs.copyFileSync(srcPath, targetPath);

  // 添加到 companyAlbum
  const albumItem = {
    id: 'a' + Date.now() + Math.random().toString(36).substr(2, 4),
    title: file.title,
    titleEn: file.titleEn,
    category: file.category,
    image: '/uploads/album/' + newName
  };
  data.companyAlbum.push(albumItem);

  console.log('OK:', file.title);
  processed++;
});

// 保存 data.json
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
console.log('Done! Processed:', processed);
