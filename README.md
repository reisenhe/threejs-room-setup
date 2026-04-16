# 🧪 Three.js Scene Lab

[![React](https://img.shields.io/badge/React-19.2.5-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.183.2-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0.8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

> 基于 React Three Fiber 的 Web 3D 技术场景集合，涵盖空间建模、GLTF 模型加载、实时性能监控与模型导出等典型开发场景，适合作为学习或二次开发的参考起点。

---

## ✨ 功能特性

### 里程碑 1 — 3D 诊所场景基础

- **3D 诊所空间** — 12×8m 矩形房间，含地板网格、四面墙体、半透明天花板
- **L 形接待台** — 可配置尺寸的接待区家具
- **候诊座椅** — 支持配置排数的等候区座位
- **入口门框** — 诊所入口结构
- **交互控制** — OrbitControls 支持旋转、缩放、平移
- **专业光照** — 环境光 + 定向光 + 半球光，含阴影贴图渲染

### 里程碑 2 — 多房间交互与场景增强

- **4 房间布局** — 可独立操作的多诊室场景
- **房间淡出效果** — 选中房间时其他房间透明淡出
- **天花板切换** — 可按需隐藏/显示天花板
- **红色报警闪烁** — 单房间触发视觉报警动画
- **悬停高亮轮廓** — 基于 `@react-three/postprocessing` 的 Outline 描边效果
- **相机预设切换** — 内设一楼视角、外部主视角、慢速旋转轨道等预设，支持平滑 Lerp 过渡
- **Zustand 状态管理** — 集中管理房间选中、报警、摄像机状态
- **ClinicPage 控制面板** — 右侧 UI 面板提供房间快选、相机切换与全局重置

### 里程碑 3 — GLTF 模型加载与性能优化

- **GLTF 车模展示** — 加载真实 BMW M4 / BMW M4 Widebody 模型（含 Draco 压缩支持）
- **双模式性能对比** — 标准模式 vs 优化模式，动态 LOD 衰减与材质降级
- **实时性能监控仪表盘** — FPS、内存（MB）、DrawCall 数量、三角面数量实时展示，含图表历史趋势
- **加载进度条** — 模型加载时展示百分比进度
- **动画播放控制** — 播放 / 暂停 / 切换动画片段
- **可复用 Hooks** — `useModelLoader`、`usePerformanceMode`、`useAnimationPlayer`

### 导出页面 — 模型画廊与 GLTF 导出

- **模型画廊列表** — 左侧缩略图列表，每张缩略图为独立旋转 3D 预览
- **主预览画布** — 选中模型后在主区域展示完整可交互 3D 预览
- **GLTF / GLB 导出** — 一键将当前场景导出为 GLTF 或 GLB 文件下载
- **可选导出内容** — 网格、材质、动画、灯光等导出选项按需勾选

---

## 🗺️ 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 项目导航入口 |
| `/clinic` | 诊所场景页 | 多房间 3D 诊所监控场景 |
| `/car-model` | 车模展示页 | GLTF 车模加载与性能对比 |
| `/export` | 导出页 | 模型画廊与 GLTF/GLB 导出工具 |

---

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| [Vite](https://vitejs.dev/) | ^8.0.8 | 构建工具 |
| [React](https://react.dev/) | ^19.2.5 | UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | ^6.0.2 | 类型系统 |
| [Three.js](https://threejs.org/) | ^0.183.2 | 3D 渲染引擎 |
| [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | ^9.6.0 | React 渲染器 |
| [@react-three/drei](https://github.com/pmndrs/drei) | ^10.7.7 | 辅助组件库 |
| [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) | ^3.0.4 | 后期处理效果 |
| [Zustand](https://github.com/pmndrs/zustand) | ^5.0.12 | 状态管理 |
| [React Router DOM](https://reactrouter.com/) | ^7.14.1 | 客户端路由 |
| [Tailwind CSS](https://tailwindcss.com/) | ^4.2.2 | 原子化 CSS |

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm（推荐）/ npm / yarn

### 安装与运行

```bash
# 克隆项目
git clone <repository-url>
cd threejs-room-setup

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

应用将在 `http://localhost:5173` 启动。

### 构建与预览

```bash
# 生产构建
pnpm build

# 预览生产构建
pnpm preview
```

---

## 📁 项目结构

```
threejs-room-setup/
├── public/
│   ├── draco/gltf/               # Draco 解码器（GLTF 压缩支持）
│   ├── environments/             # HDR 环境贴图
│   └── models/                   # GLTF 模型资源
│       ├── 2021_bmw_m4_competition/
│       └── bmw_m4_widebody/
├── src/
│   ├── components/
│   │   ├── CarModel/             # 车模组件
│   │   ├── PerformanceMonitor/   # 性能监控仪表盘组件
│   │   └── Room/                 # 诊所房间组件集
│   │       ├── Room.tsx          # 主房间组件（含家具组合）
│   │       ├── RoomShell.tsx     # 纯房间外壳（地板/墙/天花板）
│   │       ├── ReceptionDesk.tsx # 接待台
│   │       ├── WaitingChairs.tsx # 候诊椅
│   │       └── DoorFrame.tsx     # 入口门框
│   ├── hooks/
│   │   ├── useModelLoader.ts     # GLTF 模型加载 Hook
│   │   ├── usePerformanceMode.ts # 性能模式切换 Hook
│   │   └── useAnimationPlayer.ts # 动画播放控制 Hook
│   ├── pages/
│   │   ├── HomePage.tsx          # 首页
│   │   ├── ClinicPage.tsx        # 诊所监控页
│   │   ├── CarModelPage.tsx      # 车模展示页
│   │   └── ExportPage.tsx        # 模型导出页
│   ├── scene/
│   │   ├── ClinicScene.tsx       # 多房间诊所 3D 场景
│   │   └── CameraController.tsx  # 相机预设控制器
│   ├── store/
│   │   ├── useClinicStore.ts     # 诊所场景状态
│   │   └── usePerformanceStore.ts# 性能监控状态
│   ├── utils/
│   │   ├── gltfExporter.ts       # GLTF 导出工具
│   │   └── modelRegistry.tsx     # 模型注册表
│   ├── App.tsx                   # 路由配置与应用入口
│   ├── main.tsx                  # 渲染入口
│   └── index.css                 # 全局样式（Tailwind CSS v4）
├── package.json
├── tsconfig.json
├── vite.config.ts
└── AGENT.md                      # AI 开发约束规范
```

---

## 🎓 通过本项目你能学到什么

本项目涵盖多个典型 Web 3D 开发场景，适合以下方向的开发者参考学习：

| 技术场景 | 涉及知识点 | 对应页面 |
|----------|-----------|---------|
| **3D 场景搭建** | BufferGeometry 组合建模、光照系统（环境光/定向光/半球光）、阴影贴图 | 诊所场景 |
| **场景交互控制** | OrbitControls 鼠标交互、相机位置 Lerp 平滑过渡、多个预设视角切换 | 诊所场景 |
| **后期处理效果** | `@react-three/postprocessing` Outline 描边高亮、EffectComposer 组合 | 诊所场景 |
| **实例化渲染** | `<instancedMesh>` 声明式批量渲染、减少 DrawCall | 诊所场景 |
| **GLTF 模型加载** | `useGLTF` 缓存加载、DRACOLoader 压缩解码、加载进度回调 | 车模展示 |
| **性能监控与优化** | FPS / 内存 / DrawCall / 三角面实时采集、双模式 LOD 切换、材质降级 | 车模展示 |
| **动画播放控制** | `AnimationMixer`、播放 / 暂停 / 切换动画片段的 Hook 封装 | 车模展示 |
| **GLTF 场景导出** | `GLTFExporter` 导出流程、Blob 文件下载、多格式（GLTF / GLB）支持 | 导出工具 |
| **3D 缩略图渲染** | 多 Canvas 独立场景、旋转预览、模型注册表模式 | 导出工具 |
| **Zustand 状态管理** | 多组件共享 3D 场景状态、低频 UI 状态与高频 ref 更新的分离策略 | 全局 |
| **React Router 路由** | 路由驱动的多页面架构、懒加载与 Suspense 配合 | 全局 |
| **Tailwind CSS v4** | 原子化样式与内联动态颜色混用、暗色/亮色主题适配 | 全局 |

---

## 🗺️ 里程碑进度

- [x] **里程碑 1** — 3D 诊所基础场景（房间、家具、光照、交互控制）
- [x] **里程碑 2** — 多房间交互系统（4 房间布局、报警、高亮、相机预设、Zustand 状态管理）
- [x] **里程碑 3** — GLTF 模型加载与性能优化（车模展示、双模式对比、实时性能监控仪表盘）
- [x] **扩展功能** — 模型画廊导出页（缩略图预览、GLTF/GLB 一键导出）

---

## 📄 许可证

[MIT](LICENSE)

---

*Built with React Three Fiber + Three.js*
