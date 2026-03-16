---
name: weighingtech-data-manager
description: |
  管理唯英科技官网的产品数据、图片和视频资源。
  核心能力：根据文件名自动识别资源类型并归类、智能 JSON 操作（不一次性读取整个文件）、产品/分类/相册/视频的增删改查。
  资源路径规则：
  - 产品图片：public/uploads/products/{产品编码}/
  - 360° 图片：public/uploads/products/{产品编码}/360/
  - 文档：public/uploads/products/{产品编码}/docs/
  - 相册：public/uploads/albums/
  - 视频：public/uploads/videos/
  触发场景：(1) 上传产品图片/文档 (2) 添加/更新产品 (3) 管理分类 (4) 上传 360° 图片 (5) 管理相册/视频
---

# WeighingTech Data Manager

## 核心原则

1. **文件名即线索**：从文件名解析出产品编码、资源类型、序号等信息
2. **JSON 流式操作**：不把大 JSON 全文加载到上下文，用脚本工具按需查询/修改
3. **原子操作**：每步操作都有反馈，出错可回滚
4. **询问确认**：不擅自执行，先告知用户将要做什么

---

## 交互流程（必须遵守）

### 步骤 1：解析文件名
分析文件名，提取：产品编码、资源类型、序号、标题等信息

### 步骤 2：确认解析结果
告诉用户你理解了什么，格式：
```
📁 文件名: {原文件名}
📍 目标: {产品编码}/{资源类型}
📝 操作: {复制/移动} → {目标路径}
```

### 步骤 3：等待确认
**不要直接执行**，等用户确认"可以"、"执行"、"ok"等明确指令

### 步骤 4：执行并反馈
执行后告知结果："✅ 已完成" 或 "❌ 失败原因"

### 特殊情况：文件名无法理解
如果文件名没有有效信息（如 `IMG_001.jpg`、`新建文件.png`），必须询问用户：
```
❓ 无法识别文件名 "{文件名}" 的含义，请告诉我：
1. 这是什么产品的图片？（产品编码）
2. 是什么类型的资源？（封面/360°/相册/文档）
3. 如果是相册，标题是什么？
```

---

## 资源路径规则

| 资源类型 | 存储目录 | 引用路径前缀 |
|---------|---------|-------------|
| 产品封面图 | `public/uploads/products/{code}/` | `/uploads/products/{code}/` |
| 360° 图片 | `public/uploads/products/{code}/360/` | `/uploads/products/{code}/360/` |
| 产品文档 | `public/uploads/products/{code}/docs/` | `/uploads/products/{code}/docs/` |
| 相册图片 | `public/uploads/albums/` | `/uploads/albums/` |
| 视频缩略图 | `public/uploads/videos/` | `/uploads/videos/` |
| 视频文件 | `public/uploads/video/` | `/uploads/video/` |
| 微信/QQ 二维码 | `public/uploads/consult/` | `/uploads/consult/` |

---

## 文件名解析规则

根据文件名自动识别资源类型：

```
格式: {类型}-{产品编码}-{序号}.{扩展名}

类型标识:
  cover      → 产品封面图
  360        → 360° 图片序列
  doc        → 产品文档
  album      → 相册图片
  video-thumb → 视频缩略图
  video      → 视频文件
  wechat     → 微信二维码
  qq         → QQ 二码图
```

### 示例

| 文件名 | 解析结果 |
|--------|---------|
| `cover-XK-T680A.jpg` | 产品 XK-T680A 的封面图 |
| `360-XK-T680A-01.png` | 产品 XK-T680A 的 360° 图片（第1张） |
| `doc-XK-T680A-说明书.pdf` | 产品 XK-T680A 的说明书 |
| `album-工厂.jpg` | 相册图片，标题"工厂" |
| `video-thumb-防作弊.mp4` | 视频"防作弊"的缩略图 |

---

## JSON 操作（流式）

### 工具脚本

创建 `scripts/data-manager.cjs` 工具脚本，实现以下功能：

```javascript
// 用法: node scripts/data-manager.cjs <command> [args]

// 1. 查询产品（按编码）
node scripts/data-manager.cjs get-product XK-T680A

// 2. 查询所有产品（仅返回基本字段）
node scripts/data-manager.cjs list-products

// 3. 按分类筛选产品
node scripts/data-manager.cjs products-by-category platform_scale

// 4. 添加产品
node scripts/data-manager.cjs add-product '{"name":"测试","code":"TEST-001","category":"platform_scale"}'

// 5. 更新产品字段
node scripts/data-manager.cjs update-product XK-T680A image "/product/XK-T680A/cover.jpg"

// 6. 删除产品
node scripts/data-manager.cjs delete-product XK-T680A

// 7. 查询分类
node scripts/data-manager.cjs list-categories

// 8. 添加分类
node scripts/data-manager.cjs add-category '{"id":"new_cat","name":"新分类","nameEn":"New Category"}'

// 9. 查询相册
node scripts/data-manager.cjs list-album

// 10. 添加相册项
node scripts/data-manager.cjs add-album '{"title":"新图片","category":"all","image":"/uploads/album/xxx.jpg"}'

// 11. 查询视频
node scripts/data-manager.cjs list-videos

// 12. 添加视频
node scripts/data-manager.cjs add-video '{"title":"新视频","category":"all","thumbnail":"","videoUrl":""}'

// 13. 更新联系信息
node scripts/data-manager.cjs update-contact phone "023-68283031"
```

### 脚本输出格式

```json
// 成功
{"success": true, "data": {...}}

// 失败
{"success": false, "error": "错误信息"}
```

---

## 操作流程

### 场景 1：上传产品封面图

```bash
# 1. 根据文件名解析
# 文件: cover-XK-T680A.jpg
# → 产品编码: XK-T680A
# → 类型: 封面图

# 2. 复制文件到正确位置
# → public/uploads/products/XK-T680A/cover.jpg

# 3. 更新 JSON（查询产品是否存在）
node scripts/data-manager.cjs get-product XK-T680A

# 4. 如果产品存在，更新 image 字段
node scripts/data-manager.cjs update-product XK-T680A image "/product/XK-T680A/cover.jpg"

# 5. 如果产品不存在，提示用户先创建产品
```

### 场景 2：上传 360° 图片序列

```bash
# 文件: 360-XK-T680A-01.png, 360-XK-T680A-02.png, ...

# 1. 创建 360 目录
mkdir -p public/uploads/products/XK-T680A/360

# 2. 复制所有文件（序号即文件名）
# 360-XK-T680A-01.png → public/uploads/products/XK-T680A/360/1.png

# 3. 统计数量并更新产品
count=$(ls public/uploads/products/XK-T680A/360/ | wc -l)
node scripts/data-manager.cjs update-product XK-T680A has360 true
node scripts/data-manager.cjs update-product XK-T680A images360Count $count
```

### 场景 3：生成 360° 产品图片（从视频）

```bash
# 需要先有产品记录，然后运行 Python 脚本转换视频

# 1. 确认产品存在
node scripts/data-manager.cjs get-product QJF-2765

# 2. 运行视频转换脚本（需要 FFmpeg）
python convert_product.py "QJF 2765"

# 输出位置: public/uploads/products/QJF 2765/
# ├── cover.jpg      (封面)
# └── 360/
#     ├── 1.jpg      (第1张)
#     ├── 2.jpg
#     ...
#     └── 36.jpg     (第36张)

# 3. 更新产品记录
node scripts/data-manager.cjs update-product "QJF 2765" image "/uploads/products/QJF 2765/cover.jpg"
node scripts/data-manager.cjs update-product "QJF 2765" has360 true
node scripts/data-manager.cjs update-product "QJF 2765" images360Count 36
```

**脚本位置**: `convert_product.py`（项目根目录）

**依赖**: FFmpeg（需安装并配置路径）

**视频文件**: 放在项目根目录或 `I:\{产品编号}.MXF`

### 场景 4：添加新产品（带图片）

```bash
# 1. 创建产品目录
mkdir -p public/uploads/products/NEW-CODE/docs

# 2. 复制封面图（如果有）
cp new-cover.jpg public/uploads/products/NEW-CODE/cover.jpg

# 3. 添加产品记录
node scripts/data-manager.cjs add-product '{
  "name": "新产品名称",
  "nameEn": "New Product",
  "code": "NEW-CODE",
  "category": "platform_scale",
  "image": "/product/NEW-CODE/cover.jpg",
  "description": "",
  "descriptionEn": ""
}'
```

### 场景 4：上传相册图片

```bash
# 文件: album-工厂参观.jpg

# 1. 复制到相册目录
cp "album-工厂参观.jpg" public/uploads/album/

# 2. 添加相册记录
node scripts/data-manager.cjs add-album '{
  "title": "工厂参观",
  "category": "team",
  "image": "/uploads/album/工厂参观.jpg"
}'
```

---

## 产品字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | ✅ | 唯一标识符（自动生成） |
| name | string | ✅ | 产品中文名 |
| nameEn | string | - | 产品英文名 |
| code | string | ✅ | 产品编码（用于目录命名） |
| category | string | ✅ | 分类 ID（参考 categories） |
| description | string | - | 中文描述（HTML） |
| descriptionEn | string | - | 英文描述（HTML） |
| image | string | - | 封面图路径 |
| has360 | boolean | - | 是否有 360° 图片 |
| images360Count | number | - | 360° 图片数量 |
| specs | array | - | 技术规格 |
| documents | array | - | 文档列表 |

---

## 分类 ID 参考

从 `categories` 中获取，当前常见分类：
- `platform_scale` - 平台秤仪表
- `junction_box` - 接线盒
- `digital_indicator` - 数字式仪表
- `digital_module` - 数字模块
- `wireless_terminal` - 无线终端
- `axle_id` - 轮轴识别仪
- `accessories` - 其他配件

---

## 错误处理

1. **产品不存在**：先创建产品再关联图片
2. **目录已存在**：覆盖或提示用户确认
3. **JSON 格式错误**：脚本会自动备份原文件
4. **权限问题**：检查目录写权限

---

## 工作流总结

```
收到文件 → 解析文件名 → 确认目标目录 → 复制/移动文件 → 查询/更新 JSON → 反馈结果
```

每一步都有明确的命令执行，不依赖大 JSON 的全文读取。
