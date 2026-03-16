const fs = require('fs');
const path = require('path');

// 从命令行参数获取要保存的产品数据
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('用法: node export_data.cjs <json数据>');
  console.log('示例: node export_data.cjs \'{"products":[...]}\'');
  process.exit(1);
}

try {
  const data = JSON.parse(args[0]);
  const dataPath = path.join(__dirname, 'data.json');

  // 读取现有data.json
  const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // 更新products，保留其他字段
  const newData = {
    ...existingData,
    products: data.products
  };

  fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));
  console.log('✓ data.json 已更新');
  console.log(`✓ 共保存 ${data.products.length} 个产品`);
} catch (e) {
  console.error('✗ 更新失败:', e.message);
  process.exit(1);
}
