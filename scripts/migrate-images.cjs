const fs = require('fs');
const path = require('path');

const srcDir = 'I:\\weighingtech_src\\products';
const targetBase = 'I:\\weighingtech_src\\next-app\\public\\product';
const dataFile = 'I:\\weighingtech_src\\next-app\\src\\data.json';

// 读取产品映射
const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
const idToCode = {};
data.products.forEach(p => idToCode[p.id] = p.code);

// 获取源目录
const dirs = fs.readdirSync(srcDir).filter(d => d !== 'QJF 2765');
console.log('Found product dirs:', dirs.length);

let processed = 0;
dirs.forEach(dir => {
  const code = idToCode[dir];
  if (!code) {
    console.log('Skip: no code for id', dir);
    return;
  }

  // 清理 code 中的非法字符（用于目录名）
  const safeCode = code.replace(/[<>:"/\\|?*]/g, '-');

  // 找到图片文件
  const srcFiles = fs.readdirSync(path.join(srcDir, dir));
  const imgFile = srcFiles.find(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f));
  if (!imgFile) {
    console.log('Skip: no image for', code);
    return;
  }

  const srcPath = path.join(srcDir, dir, imgFile);
  const ext = path.extname(imgFile);
  const targetDir = path.join(targetBase, safeCode);

  // 创建目录
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetPath = path.join(targetDir, 'cover' + ext);

  // 复制文件
  fs.copyFileSync(srcPath, targetPath);

  // 更新 data.json 中的 image 路径
  const productIndex = data.products.findIndex(p => p.id === dir);
  if (productIndex !== -1) {
    data.products[productIndex].image = '/product/' + safeCode + '/cover' + ext;
  }

  console.log('OK:', code, '->', '/product/' + safeCode + '/cover' + ext);
  processed++;
});

// 保存 data.json
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
console.log('Done! Processed:', processed);
