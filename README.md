# 酸性信号 ACID SIGNAL — 酸性设计网页

一个酸性设计（Acid Graphics / Y2K-Rave）风格的单页网页：虚构地下视听派对「酸性信号 VOL.03」。纯 HTML / CSS / JS，无构建步骤、无依赖。

## 直接打开

- 双击 `index.html` 即可在浏览器中查看；
- 或起本地服务（推荐，字体与滤镜表现一致）：

```bash
python -m http.server 8123
# 打开 http://127.0.0.1:8123
```

## 文件

| 文件 | 作用 |
|---|---|
| `index.html` | 页面结构与文案（中英混排）、SVG 液态滤镜与图形符号 |
| `style.css` | 全部视觉：铬金属渐变、液态 blob、全息、glitch、噪点/扫描线、跑马灯、响应式 |
| `main.js` | 交互：液态扭曲动画、3D 倾斜卡片、磁吸按钮、自定义光标、滚动入场、ACID MAX 开关、toast |
| `lab.html` + `lab.css` | 独立分页「酸性实验室」：Marathon 平面 / Apex 皮肤材质 / 明日方舟版式语法的三源参考合成方案（REF.SYNTH 001），首页风格零改动 |
| `works.html` + `works.js` + `works.css` | 作品档案：数据驱动作品墙 + 分类筛选 + 详情灯箱 + `#w0x` 站点深链 —— 艺术集展示站的主展厅骨架 |
| `404.html` | 酸性风格 404 页（信号丢失 SIGNAL LOST） |
| `tools/serve.py` | 开发服务器（强制 `Cache-Control: no-store`，杜绝改完样式还吃磁盘缓存） |
| `gui-test-screenshots/` | GUI 测试截图存证（修复前后） |

## 酸性设计要素

- **液态文字扭曲**：SVG `feTurbulence` + `feDisplacementMap`，标题与大字持续“融化”并缓慢沸腾
- **铬金属质感**：多段银灰渐变 + `background-clip: text`，铬球带高光扫过
- **撞色**：近黑底 + 酸绿 `#d8ff00` / 品红 `#ff2d95` / 青 `#00e5ff` / 紫 `#7b2dff`
- **Glitch 故障**：RGB 分层错位（悬停阵容行触发，标题偶发爆发）
- **Y2K 元素**：透视网格、四角星、旋转环形贴纸、圆点徽章
- **噪点 / 扫描线 / 跑马灯**：全局质感层
- **ACID MAX 模式**：右上角开关，一键拉满扭曲强度、加快所有动画

## 交互一览

- 导航锚点平滑滚动；悬停阵容行 → 酸绿填充 + glitch
- 标本卡片 3D 倾斜 + 高光跟随；主按钮磁吸效果
- 票档按钮 / 登记按钮 → toast 反馈（虚构活动，仅演示）
- 自定义光标（触屏设备自动回退系统光标）；滚动进度条；滚动入场动画
- 支持 `prefers-reduced-motion`：自动关闭全部动画与扭曲

## 后续改造为艺术集展示网站

站点已按「作品档案」形态打好骨架，改造路径：

| 现状 | 改造方向 |
|---|---|
| `works.html` 作品墙 + 筛选 + 灯箱 + 站点深链 | 艺术集主展厅 |
| `lab.html` 酸性实验室（参考合成方案） | 创作笔记 / 手记专栏 |
| 首页「作品精选 + 关于与联系」 | 展厅入口 + 艺术家自述 |
| 首页 `#signal/#lineup/#access` 活动叙事 | 可整段替换为展览履历 / 系列阐述 |

### 新增一件作品
1. 在 `works.js` 的 `WORKS` 数组加一条数据：`{ id:'w13', no:'013', title, titleEn, year, tags:['liquid'], art:'liquid', series:'字形实验', medium, desc, featured }`（series 取：材质研究 / 字形实验 / 平面考古）；
2. `tags` 取液态 liquid / 铬 chrome / 全息 holo / 故障 glitch / 平面 flat（分类筛选按钮自动生成）；
3. `art` 复用现有图形语言（liquid / chrome / holo / glitch / flat / halftone / reactive / sticker）；新材料在 `works.js` 的 `artMarkup()` 与 `works.css` 各加一段；
4. 访问 `works.html#w09` 即为该作品的永久链接（深链直达灯箱）。

### 新增一个页面
复制 `works.html` 骨架（特效层 + SVG defs + 导航 + 页脚），替换 `<main>` 内容，样式放独立 css；三个页面的导航各加一行链接。

### 质量审查口径
`python tools/serve.py` 起本地服务。物理结构与画面质感的量化审查项：溢出 / 裁切 / 重叠 / 层级与指针穿透 / 触达区 / 字体阶梯 / **色板纪律**（核心色板，参考卡限定色仅限 `.mara-poster` 内）/ 纹理原语（颗粒·扫描线·液态扭曲·铬字·跑马灯·glitch）/ 对比度 / 圆角语言（`--r-card`）/ 间距节奏。

## 说明

字体经 Google Fonts 加载（Unbounded / Space Mono / Noto Sans SC），离线时回退系统字体。页面为虚构活动的设计演示，无真实票务。
