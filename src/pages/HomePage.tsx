import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[linear-gradient(135deg,#e3f2fd_0%,#bbdefb_50%,#90caf9_100%)] p-8 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-[#1565c0] mb-4 drop-shadow-sm">
          Clinic Monitor 3D
        </h1>
        <p className="text-xl text-[#424242] max-w-xl leading-relaxed">
          一个交互式的3D诊所监控系统，提供沉浸式的医疗环境可视化和模型导出功能
        </p>
      </div>

      <div className="flex gap-8 flex-wrap justify-center max-w-4xl">
        <Link to="/clinic" className="no-underline">
          <div className="bg-white rounded-2xl p-10 w-80 shadow-[0_8px_32px_rgba(21,101,192,0.15)] transition-all duration-300 cursor-pointer border-2 border-transparent hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(21,101,192,0.25)] hover:border-[#1565c0]">
            <div className="w-16 h-16 bg-[linear-gradient(135deg,#1565c0,#42a5f5)] rounded-xl flex items-center justify-center mb-6">
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
            <p className="text-base text-[#616161] leading-normal">
              进入交互式3D诊所环境，浏览候诊区、接待台等区域，支持自由视角导航
            </p>
          </div>
        </Link>

        <Link to="/export" className="no-underline">
          <div className="bg-white rounded-2xl p-10 w-80 shadow-[0_8px_32px_rgba(21,101,192,0.15)] transition-all duration-300 cursor-pointer border-2 border-transparent hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(21,101,192,0.25)] hover:border-[#1565c0]">
            <div className="w-16 h-16 bg-[linear-gradient(135deg,#00897b,#26a69a)] rounded-xl flex items-center justify-center mb-6">
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
            <p className="text-base text-[#616161] leading-normal">
              导出3D诊所模型为多种格式，支持OBJ、GLTF等标准格式，便于在其他软件中使用
            </p>
          </div>
        </Link>
      </div>

      <footer className="mt-16 text-[#757575] text-sm">
        Clinic Monitor 3D &copy; 2026
      </footer>
    </div>
  )
}

export default HomePage
