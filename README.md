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

## 说明

字体经 Google Fonts 加载（Unbounded / Space Mono / Noto Sans SC），离线时回退系统字体。页面为虚构活动的设计演示，无真实票务。
