/**
 * 数据管理命令行工具
 * 用法: node scripts/data-manager.cjs <command> [args]
 *
 * 示例:
 *   node scripts/data-manager.cjs get-product XK-T680A
 *   node scripts/data-manager.cjs list-products
 *   node scripts/data-manager.cjs add-product '{"name":"测试","code":"TEST-001"}'
 *   node scripts/data-manager.cjs update-product XK-T680A image "/product/XK-T680A/cover.jpg"
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../src/data.json');
const BACKUP_DIR = path.join(__dirname, '../.data-backups');

// 确保备份目录存在
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// 读取数据（带备份）
function readData() {
  const content = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(content);
}

// 保存数据（带备份）
function saveData(data) {
  // 创建备份
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `data-${timestamp}.json`);
  fs.copyFileSync(DATA_FILE, backupFile);

  // 清理旧备份（保留最近10个）
  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('data-'))
    .sort()
    .reverse();
  backups.slice(10).forEach(f => {
    fs.unlinkSync(path.join(BACKUP_DIR, f));
  });

  // 保存新数据
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// 输出 JSON 结果
function output(result) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}

// ============ 命令处理 ============

const cmd = process.argv[2];
const args = process.argv.slice(3);

try {
  switch (cmd) {
    // ---------- 产品操作 ----------

    case 'get-product': {
      // 获取单个产品（按编码）
      const code = args[0];
      if (!code) output({ success: false, error: '缺少产品编码' });

      const data = readData();
      const product = data.products.find(p => p.code === code);
      if (!product) output({ success: false, error: `产品 ${code} 不存在` });

      output({ success: true, data: product });
      break;
    }

    case 'list-products': {
      // 列出所有产品（仅基本字段）
      const data = readData();
      const list = data.products.map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        nameEn: p.nameEn,
        category: p.category,
        has360: p.has360,
        images360Count: p.images360Count
      }));
      output({ success: true, data: list, total: list.length });
      break;
    }

    case 'products-by-category': {
      // 按分类筛选产品
      const categoryId = args[0];
      if (!categoryId) output({ success: false, error: '缺少分类ID' });

      const data = readData();
      const list = data.products.filter(p => p.category === categoryId);
      output({ success: true, data: list, total: list.length });
      break;
    }

    case 'add-product': {
      // 添加产品
      if (!args[0]) output({ success: false, error: '缺少产品数据 JSON' });

      const productData = JSON.parse(args[0]);
      const data = readData();

      // 检查编码是否重复
      if (data.products.some(p => p.code === productData.code)) {
        output({ success: false, error: `产品编码 ${productData.code} 已存在` });
      }

      // 生成 ID
      const id = 'p' + Date.now();
      const newProduct = {
        id,
        name: productData.name || '',
        nameEn: productData.nameEn || '',
        code: productData.code || '',
        category: productData.category || 'accessories',
        description: productData.description || '',
        descriptionEn: productData.descriptionEn || '',
        image: productData.image || '',
        has360: productData.has360 || false,
        images360Count: productData.images360Count || 0,
        specs: productData.specs || [],
        documents: productData.documents || []
      };

      data.products.push(newProduct);
      saveData(data);

      output({ success: true, data: newProduct });
      break;
    }

    case 'update-product': {
      // 更新产品字段
      // 用法: update-product <code> <field> <value> [field2 value2 ...]
      const code = args[0];
      if (!code) output({ success: false, error: '缺少产品编码' });

      const data = readData();
      const index = data.products.findIndex(p => p.code === code);
      if (index === -1) output({ success: false, error: `产品 ${code} 不存在` });

      // 解析字段更新
      const updates = {};
      for (let i = 1; i < args.length; i += 2) {
        const field = args[i];
        const value = args[i + 1];
        if (field && value !== undefined) {
          // 尝试解析 JSON 值
          try {
            updates[field] = JSON.parse(value);
          } catch {
            updates[field] = value;
          }
        }
      }

      data.products[index] = { ...data.products[index], ...updates };
      saveData(data);

      output({ success: true, data: data.products[index] });
      break;
    }

    case 'delete-product': {
      // 删除产品
      const code = args[0];
      if (!code) output({ success: false, error: '缺少产品编码' });

      const data = readData();
      const index = data.products.findIndex(p => p.code === code);
      if (index === -1) output({ success: false, error: `产品 ${code} 不存在` });

      const deleted = data.products.splice(index, 1)[0];
      saveData(data);

      output({ success: true, data: deleted });
      break;
    }

    // ---------- 分类操作 ----------

    case 'list-categories': {
      // 列出所有分类
      const data = readData();
      output({
        success: true,
        data: {
          categories: data.categories,
          albumCategories: data.albumCategories,
          solutionCategories: data.solutionCategories
        }
      });
      break;
    }

    case 'add-category': {
      // 添加分类
      // 用法: add-category <type> <json>
      // type: categories | albumCategories | solutionCategories
      const type = args[0];
      const jsonStr = args.slice(1).join(' ');

      if (!type || !jsonStr) output({ success: false, error: '用法: add-category <type> <json>' });
      if (!['categories', 'albumCategories', 'solutionCategories'].includes(type)) {
        output({ success: false, error: '无效类型，仅支持: categories, albumCategories, solutionCategories' });
      }

      const categoryData = JSON.parse(jsonStr);
      const data = readData();

      // 检查 ID 重复
      if (data[type].some(c => c.id === categoryData.id)) {
        output({ success: false, error: `分类 ID ${categoryData.id} 已存在` });
      }

      data[type].push(categoryData);
      saveData(data);

      output({ success: true, data: categoryData });
      break;
    }

    case 'update-category': {
      // 更新分类
      const type = args[0];
      const id = args[1];
      const jsonStr = args.slice(2).join(' ');

      if (!type || !id || !jsonStr) output({ success: false, error: '用法: update-category <type> <id> <json>' });

      const data = readData();
      const index = data[type]?.findIndex(c => c.id === id);
      if (index === -1) output({ success: false, error: `分类 ${id} 不存在` });

      const updates = JSON.parse(jsonStr);
      data[type][index] = { ...data[type][index], ...updates };
      saveData(data);

      output({ success: true, data: data[type][index] });
      break;
    }

    // ---------- 相册操作 ----------

    case 'list-album': {
      // 列出相册
      const data = readData();
      output({ success: true, data: data.companyAlbum, total: data.companyAlbum.length });
      break;
    }

    case 'add-album': {
      // 添加相册项
      if (!args[0]) output({ success: false, error: '缺少相册数据 JSON' });

      const albumData = JSON.parse(args[0]);
      const data = readData();

      const newItem = {
        id: 'a' + Date.now(),
        title: albumData.title || '',
        titleEn: albumData.titleEn || '',
        category: albumData.category || 'all',
        image: albumData.image || ''
      };

      data.companyAlbum.push(newItem);
      saveData(data);

      output({ success: true, data: newItem });
      break;
    }

    case 'update-album': {
      // 更新相册项
      const id = args[0];
      const jsonStr = args.slice(1).join(' ');

      if (!id || !jsonStr) output({ success: false, error: '用法: update-album <id> <json>' });

      const data = readData();
      const index = data.companyAlbum.findIndex(a => a.id === id);
      if (index === -1) output({ success: false, error: `相册项 ${id} 不存在` });

      const updates = JSON.parse(jsonStr);
      data.companyAlbum[index] = { ...data.companyAlbum[index], ...updates };
      saveData(data);

      output({ success: true, data: data.companyAlbum[index] });
      break;
    }

    case 'delete-album': {
      // 删除相册项
      const id = args[0];
      if (!id) output({ success: false, error: '缺少相册项 ID' });

      const data = readData();
      const index = data.companyAlbum.findIndex(a => a.id === id);
      if (index === -1) output({ success: false, error: `相册项 ${id} 不存在` });

      const deleted = data.companyAlbum.splice(index, 1)[0];
      saveData(data);

      output({ success: true, data: deleted });
      break;
    }

    // ---------- 视频操作 ----------

    case 'list-videos': {
      // 列出视频
      const data = readData();
      output({ success: true, data: data.solutionVideos, total: data.solutionVideos.length });
      break;
    }

    case 'add-video': {
      // 添加视频
      if (!args[0]) output({ success: false, error: '缺少视频数据 JSON' });

      const videoData = JSON.parse(args[0]);
      const data = readData();

      const newItem = {
        id: 'v' + Date.now(),
        title: videoData.title || '',
        titleEn: videoData.titleEn || '',
        category: videoData.category || 'all',
        thumbnail: videoData.thumbnail || '',
        videoUrl: videoData.videoUrl || ''
      };

      data.solutionVideos.push(newItem);
      saveData(data);

      output({ success: true, data: newItem });
      break;
    }

    case 'update-video': {
      // 更新视频
      const id = args[0];
      const jsonStr = args.slice(1).join(' ');

      if (!id || !jsonStr) output({ success: false, error: '用法: update-video <id> <json>' });

      const data = readData();
      const index = data.solutionVideos.findIndex(v => v.id === id);
      if (index === -1) output({ success: false, error: `视频 ${id} 不存在` });

      const updates = JSON.parse(jsonStr);
      data.solutionVideos[index] = { ...data.solutionVideos[index], ...updates };
      saveData(data);

      output({ success: true, data: data.solutionVideos[index] });
      break;
    }

    case 'delete-video': {
      // 删除视频
      const id = args[0];
      if (!id) output({ success: false, error: '缺少视频 ID' });

      const data = readData();
      const index = data.solutionVideos.findIndex(v => v.id === id);
      if (index === -1) output({ success: false, error: `视频 ${id} 不存在` });

      const deleted = data.solutionVideos.splice(index, 1)[0];
      saveData(data);

      output({ success: true, data: deleted });
      break;
    }

    // ---------- 联系信息操作 ----------

    case 'get-contact': {
      // 获取联系信息
      const data = readData();
      output({ success: true, data: data.contact });
      break;
    }

    case 'update-contact': {
      // 更新联系信息
      // 用法: update-contact <field> <value>
      const field = args[0];
      const value = args.slice(1).join(' ');

      if (!field) output({ success: false, error: '用法: update-contact <field> <value>' });

      const data = readData();
      data.contact = data.contact || {};
      data.contact[field] = value;
      saveData(data);

      output({ success: true, data: data.contact });
      break;
    }

    // ---------- 咨询信息操作 ----------

    case 'get-consult': {
      // 获取咨询信息
      const data = readData();
      output({ success: true, data: data.consult });
      break;
    }

    case 'update-consult': {
      // 更新咨询信息
      const jsonStr = args.join(' ');
      if (!jsonStr) output({ success: false, error: '用法: update-consult <json>' });

      const updates = JSON.parse(jsonStr);
      const data = readData();
      data.consult = { ...data.consult, ...updates };
      saveData(data);

      output({ success: true, data: data.consult });
      break;
    }

    // ---------- 工具命令 ----------

    case 'init-product-dir': {
      // 初始化产品目录
      const code = args[0];
      if (!code) output({ success: false, error: '缺少产品编码' });

      const dirs = [
        path.join(__dirname, '../public/product', code),
        path.join(__dirname, '../public/product', code, '360'),
        path.join(__dirname, '../public/product', code, 'docs')
      ];

      dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      output({ success: true, data: { code, dirs: dirs.map(d => d.replace(__dirname + '/../', '')) } });
      break;
    }

    case 'search': {
      // 搜索产品（支持模糊匹配）
      const keyword = args[0]?.toLowerCase();
      if (!keyword) output({ success: false, error: '缺少搜索关键词' });

      const data = readData();
      const results = data.products.filter(p =>
        p.name?.toLowerCase().includes(keyword) ||
        p.nameEn?.toLowerCase().includes(keyword) ||
        p.code?.toLowerCase().includes(keyword) ||
        p.description?.toLowerCase().includes(keyword)
      );

      output({
        success: true,
        data: results.map(p => ({
          id: p.id,
          code: p.code,
          name: p.name,
          nameEn: p.nameEn,
          category: p.category
        })),
        total: results.length
      });
      break;
    }

    case 'stats': {
      // 统计数据
      const data = readData();
      output({
        success: true,
        data: {
          products: data.products.length,
          categories: data.categories.length,
          albumCategories: data.albumCategories.length,
          solutionCategories: data.solutionCategories.length,
          companyAlbum: data.companyAlbum.length,
          solutionVideos: data.solutionVideos.length
        }
      });
      break;
    }

    default:
      output({
        success: false,
        error: `未知命令: ${cmd}`,
        help: `
可用命令:
  产品操作:
    get-product <code>              获取产品
    list-products                   列出所有产品
    products-by-category <id>       按分类筛选
    add-product <json>              添加产品
    update-product <code> <field> <value> [...]  更新产品
    delete-product <code>           删除产品
    search <keyword>                搜索产品

  分类操作:
    list-categories                 列出所有分类
    add-category <type> <json>      添加分类

  相册操作:
    list-album                      列出相册
    add-album <json>                添加相册项
    update-album <id> <json>        更新相册项
    delete-album <id>               删除相册项

  视频操作:
    list-videos                     列出视频
    add-video <json>                添加视频
    update-video <id> <json>        更新视频
    delete-video <id>               删除视频

  联系信息:
    get-contact                     获取联系信息
    update-contact <field> <value>  更新联系信息

  咨询信息:
    get-consult                     获取咨询信息
    update-consult <json>           更新咨询信息

  工具:
    init-product-dir <code>         初始化产品目录
    search <keyword>                搜索产品
    stats                           统计数据
`
      });
  }
} catch (err) {
  output({ success: false, error: err.message });
}
