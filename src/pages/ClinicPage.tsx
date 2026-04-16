import { Link } from 'react-router-dom'
import ClinicScene from '../scene/ClinicScene'
import { useClinicStore } from '../store/useClinicStore'
import { PerformancePanel } from '../components/PerformanceMonitor'

function ClinicPage() {
  const {
    selectedRoomId,
    selectRoom,
    triggerFlash,
    cameraPreset,
    setCameraPreset,
  } = useClinicStore()

  const roomButtons = [
    { id: 1, label: '房间1' },
    { id: 2, label: '房间2' },
    { id: 3, label: '房间3' },
    { id: 4, label: '房间4' },
  ]

  const cameraButtons = [
    { preset: 'floor1' as const, label: '1楼视角' },
    { preset: 'overview' as const, label: '外部主视角' },
    { preset: 'autoRotate' as const, label: '缓慢旋转' },
  ]

  const handleRoomClick = (id: number) => {
    if (selectedRoomId === id) {
      selectRoom(null)
    } else {
      selectRoom(id)
    }
  }

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-surface">
      <ClinicScene />

      {/* 返回首页按钮 */}
      <Link
        to="/"
        className="absolute top-5 left-5 no-underline z-[100]"
      >
        <div className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-xl rounded-lg shadow-lg transition-all duration-200 cursor-pointer border border-primary/20 hover:bg-white hover:scale-[1.02]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1565c0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="text-primary font-semibold text-[0.95rem] font-sans">
            返回首页
          </span>
        </div>
      </Link>

      {/* 右侧控制面板 */}
      <div className="absolute top-5 right-5 w-[200px] bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-lg z-[100] flex flex-col gap-4">
        {/* 房间选择 */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[#333] font-sans">
            房间选择
          </h3>
          <div className="flex flex-wrap gap-2">
            {roomButtons.map((room) => (
              <button
                key={room.id}
                onClick={() => handleRoomClick(room.id)}
                className={`px-4 py-2 rounded-lg border-none cursor-pointer text-[13px] font-medium font-sans transition-colors duration-200 ${
                  selectedRoomId === room.id
                    ? 'bg-primary text-white'
                    : 'bg-primary-light text-primary hover:bg-[#bbdefb]'
                }`}
              >
                {room.label}
              </button>
            ))}
          </div>
        </div>

        {/* 摄像机视角 */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[#333] font-sans">
            摄像机视角
          </h3>
          <div className="flex flex-col gap-2">
            {cameraButtons.map((cam) => (
              <button
                key={cam.preset}
                onClick={() => setCameraPreset(cam.preset)}
                className={`px-4 py-2 rounded-lg border-none cursor-pointer text-[13px] font-medium font-sans text-left transition-colors duration-200 ${
                  cameraPreset === cam.preset
                    ? 'bg-primary text-white'
                    : 'bg-primary-light text-primary hover:bg-[#bbdefb]'
                }`}
              >
                {cam.label}
              </button>
            ))}
          </div>
        </div>

        {/* 警报控制 */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[#333] font-sans">
            警报控制
          </h3>
          <button
            onClick={() => triggerFlash(1)}
            className="px-4 py-2 rounded-lg border-none cursor-pointer text-[13px] font-medium font-sans w-full bg-[#d32f2f] text-white transition-colors duration-200 hover:bg-[#b71c1c]"
          >
            触发1号房间警报
          </button>
        </div>

        {/* 返回全景按钮 */}
        {selectedRoomId !== null && (
          <div>
            <button
              onClick={() => selectRoom(null)}
              className="px-4 py-2 rounded-lg border border-primary cursor-pointer text-[13px] font-medium font-sans w-full bg-white text-primary transition-colors duration-200 hover:bg-primary-light"
            >
              返回全景
            </button>
          </div>
        )}
      </div>

      {/* Performance Monitor Panel */}
      <PerformancePanel position="bottom-left" />
    </div>
  )
}

export default ClinicPage
