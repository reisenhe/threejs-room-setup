# 🏥 Clinic Monitor 3D

[![React](https://img.shields.io/badge/React-19.2.5-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.183.2-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0.8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

> 基于 React + Three.js 的 3D 诊所/医疗区域监控可视化系统

<!-- TODO: Add screenshot -->
*截图即将添加...*

## ✨ 功能特性

### 已实现 (Milestone 1)

- 🏠 **3D 诊所空间** — 12x8m 矩形房间，包含地板（网格覆盖）、四面墙体、半透明天花板
- 🛋️ **L 形接待台** — 可配置的接待区域家具
- 🪑 **候诊座椅** — 可配置排数的等候区座椅
- 🚪 **入口门框** — 诊所入口门框架构
- 🎮 **交互控制** — 支持鼠标旋转、缩放、平移的 OrbitControls
- 💡 **专业光照** — 环境光 + 定向光 + 半球光，支持阴影贴图

### 开发中

- 👥 模拟人员流动与体温可视化
- 📊 实时监控仪表盘
- 🔥 热力图与流量分析

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| [Vite](https://vitejs.dev/) | ^8.0.8 | 构建工具 |
| [React](https://react.dev/) | ^19.2.5 | UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | ^6.0.2 | 类型系统 |
| [Three.js](https://threejs.org/) | ^0.183.2 | 3D 渲染引擎 |
| [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | ^9.6.0 | React Three.js 渲染器 |
| [@react-three/drei](https://github.com/pmndrs/drei) | ^10.7.7 | Three.js 辅助组件库 |
| [Zustand](https://github.com/pmndrs/zustand) | ^5.0.12 | 状态管理 |

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装与运行

```bash
# 克隆项目
git clone <repository-url>
cd three-js-starter

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 构建

```bash
# 生产构建
npm run build

# 预览生产构建
npm run preview
```

## 📁 项目结构

```
three-js-starter/
├── src/
│   ├── components/
│   │   └── Room/
│   │       ├── Room.tsx          # 主房间组件
│   │       ├── ReceptionDesk.tsx # 接待台组件
│   │       ├── WaitingChairs.tsx # 候诊椅组件
│   │       └── DoorFrame.tsx     # 门框组件
│   ├── scene/
│   │   └── ClinicScene.tsx       # 3D 场景组装
│   ├── store/                    # Zustand 状态管理
│   ├── styles/                   # 样式文件
│   ├── utils/                    # 工具函数
│   ├── App.tsx                   # 应用入口
│   ├── main.tsx                  # 渲染入口
│   └── index.css                 # 全局样式
├── public/                       # 静态资源
├── dist/                         # 构建输出
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🗺️ 路线图

- [x] **Milestone 1: 3D 诊所场景** — 基础房间、家具、光照与交互控制
- [ ] **Milestone 2: 人员模拟系统** — 模拟人员流动、体温颜色编码、点击详情查看、Zustand 状态管理
- [ ] **Milestone 3: 实时仪表盘** — 人员计数、体温告警、流量趋势、热力图、入口计数动画、后期特效（Bloom）、响应式布局、部署

## 📄 许可证

[MIT](LICENSE)

---

*Built with ❤️ using React + Three.js*
