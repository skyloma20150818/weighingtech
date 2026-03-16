#!/usr/bin/env python3
"""
产品视频转图片脚本（360° 产品生成）
用法: python convert_product.py "产品编号"
示例: python convert_product.py "QJF 2765"

输出目录结构:
public/uploads/products/{产品编号}/
├── cover.jpg          (第一张图作为封面)
└── 360/
    ├── 1.jpg  (第1张)
    ├── 2.jpg  (第2张)
    ...
    └── 36.jpg  (第36张)
"""

import subprocess
import os
import sys
import tempfile
from PIL import Image

# 配置
FFMPEG_PATH = r"C:\ffmpeg\bin"
BASE_DIR = r"I:\weighingtech_src\next-app"

def convert_product(product_id: str):
    """转换单个产品视频"""

    input_video = os.path.join(BASE_DIR, "..", f"{product_id}.MXF")
    output_dir = os.path.join(BASE_DIR, "public", "uploads", "products", product_id)

    if not os.path.exists(input_video):
        # 尝试在其他位置查找
        alt_video = os.path.join(BASE_DIR, f"{product_id}.MXF")
        if os.path.exists(alt_video):
            input_video = alt_video
        else:
            print(f"错误: 找不到视频文件 {input_video}")
            return False

    # 创建目录
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(os.path.join(output_dir, "360"), exist_ok=True)

    # 设置FFmpeg路径
    os.environ["PATH"] = FFMPEG_PATH + os.pathsep + os.environ["PATH"]

    # 1. 转为GIF（临时文件）
    print("转换中...")
    with tempfile.NamedTemporaryFile(suffix=".gif", delete=False) as tmp:
        gif_path = tmp.name

    cmd = [
        "ffmpeg", "-i", input_video,
        "-vf", "fps=24,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse",
        "-y", gif_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"转换失败: {result.stderr[-500:]}")
        os.remove(gif_path) if os.path.exists(gif_path) else None
        return False

    # 2. 提取36张JPG + 封面
    frames_dir = os.path.join(output_dir, "360")
    with Image.open(gif_path) as gif:
        total = gif.n_frames
        step = total // 36

        # 封面
        gif.seek(0)
        gif.convert("RGB").save(os.path.join(output_dir, "cover.jpg"), quality=85)

        # 36张图片 (序号从1开始)
        for i in range(36):
            gif.seek(i * step)
            gif.convert("RGB").save(f"{frames_dir}/{i+1}.jpg", quality=85)

    # 删除临时GIF
    os.remove(gif_path)

    # 统计
    cover_size = os.path.getsize(os.path.join(output_dir, "cover.jpg")) / 1024
    frames_count = len(os.listdir(frames_dir))

    print(f"完成!")
    print(f"  cover.jpg: {cover_size:.1f} KB")
    print(f"  360/: {frames_count} 张")
    print(f"  位置: {output_dir}")

    return True


if __name__ == "__main__":
    if len(sys.argv) < 2:
        product_id = "QJF 2765"
    else:
        product_id = sys.argv[1]

    convert_product(product_id)
