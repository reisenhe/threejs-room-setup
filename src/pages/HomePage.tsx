import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[linear-gradient(135deg,#e3f2fd_0%,#bbdefb_50%,#90caf9_100%)] p-8 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-[#1565c0] mb-4 drop-shadow-sm">
          Three.js Scene Lab
        </h1>
        <p className="text-xl text-[#424242] max-w-2xl leading-relaxed">
          基于 React Three Fiber 的 3D 技术场景集合，探索空间建模、GLTF 模型加载、实时性能监控与模型导出等典型 Web 3D 开发技术
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        <Link to="/clinic" className="no-underline flex">
          <div className="flex flex-col bg-white rounded-2xl p-10 w-full shadow-[0_8px_32px_rgba(21,101,192,0.15)] transition-all duration-300 cursor-pointer border-2 border-transparent hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(21,101,192,0.25)] hover:border-[#1565c0]">
            <div className="w-16 h-16 bg-[linear-gradient(135deg,#1565c0,#42a5f5)] rounded-xl flex items-center justify-center mb-6 shrink-0">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-[#1565c0] mb-3">
              3D 诊所场景
            </h2>
            <p className="text-base text-[#616161] leading-relaxed flex-1">
              多房间 3D 场景搭建与布局，包含 OrbitControls 交互控制、相机预设切换、设备轮廓高亮与报警动画效果
            </p>
          </div>
        </Link>

        <Link to="/export" className="no-underline flex">
          <div className="flex flex-col bg-white rounded-2xl p-10 w-full shadow-[0_8px_32px_rgba(21,101,192,0.15)] transition-all duration-300 cursor-pointer border-2 border-transparent hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(21,101,192,0.25)] hover:border-[#00897b]">
            <div className="w-16 h-16 bg-[linear-gradient(135deg,#00897b,#26a69a)] rounded-xl flex items-center justify-center mb-6 shrink-0">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-[#00897b] mb-3">
              模型导出工具
            </h2>
            <p className="text-base text-[#616161] leading-relaxed flex-1">
              GLTF 导出工作流演示：场景模型注册管理、实时3D 缩略图预览，支持 GLTF／GLB 格式一键导出
            </p>
          </div>
        </Link>

        <Link to="/car-model" className="no-underline flex">
          <div className="flex flex-col bg-white rounded-2xl p-10 w-full shadow-[0_8px_32px_rgba(21,101,192,0.15)] transition-all duration-300 cursor-pointer border-2 border-transparent hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(21,101,192,0.25)] hover:border-[#e65100]">
            <div className="w-16 h-16 bg-[linear-gradient(135deg,#e65100,#ff9800)] rounded-xl flex items-center justify-center mb-6 shrink-0">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 17h2l1-3h8l1 3h2" />
                <path d="M3 17a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2z" />
                <circle cx="7.5" cy="17.5" r="1.5" />
                <circle cx="16.5" cy="17.5" r="1.5" />
                <path d="M7 11l2-5h6l2 5" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-[#e65100] mb-3">
              车模展示
            </h2>
            <p className="text-base text-[#616161] leading-relaxed flex-1">
              BMW M4 高精度 GLTF 模型加载，支持标准／优化双模式渲染对比、动画播放控制与相同材质节点合并优化
            </p>
          </div>
        </Link>
      </div>

      <footer className="mt-16 text-[#757575] text-sm">
        Three.js Scene Lab &copy; 2026
      </footer>
    </div>
  )
}

export default HomePage
