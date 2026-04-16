import { useState } from 'react'
import { usePerformanceStore, PerformanceStatus } from '../../store/usePerformanceStore'

interface PerformancePanelProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const positionStyles: Record<string, React.CSSProperties> = {
  'top-left': { top: '16px', left: '16px' },
  'top-right': { top: '16px', right: '16px' },
  'bottom-left': { bottom: '16px', left: '16px' },
  'bottom-right': { bottom: '16px', right: '16px' },
}

const statusColors: Record<PerformanceStatus, string> = {
  good: '#4ade80',
  fair: '#facc15',
  poor: '#f87171',
  unstable: '#f87171',
}

const statusLabels: Record<PerformanceStatus, string> = {
  good: '良好',
  fair: '一般',
  poor: '较差',
  unstable: '不稳定',
}

/** 每个指标的中文说明，鼠标悬浮时展示 */
const metricDescriptions: Record<string, string> = {
  fps: '每秒渲染帧数 (Frames Per Second)。数值越高画面越流畅，通常 ≥50 为良好，30~50 为一般，<30 为较差。',
  factor: '性能因子，由 drei PerformanceMonitor 自适应计算，范围 0~100%。值越高表示当前渲染负载越轻松。',
  status: '综合性能状态。基于 FPS 与回退 (fallback) 情况自动判定：良好 / 一般 / 较差 / 不稳定。',
  refresh: '显示器刷新率 (Hz)。表示当前显示设备每秒刷新画面的最大次数。',
  flips: '性能抖动次数。记录 PerformanceMonitor 在 "提升" 与 "降级" 之间来回切换的次数，数值越大说明性能越不稳定。',
  drawCalls: 'Draw Call 次数，即 CPU 向 GPU 提交绘制命令的次数。数值过高（通常 >200）可能导致 CPU 瓶颈，可通过合并几何体、实例化渲染等方式优化。',
  triangles: '当前帧渲染的三角面总数。数值越大 GPU 负载越高，可通过 LOD、剔除、简化模型等方式降低。',
}

function getFpsColor(fps: number): string {
  if (fps >= 50) return '#4ade80'
  if (fps >= 30) return '#facc15'
  return '#f87171'
}

function getDrawCallColor(calls: number): string {
  if (calls <= 100) return '#4ade80'
  if (calls <= 200) return '#facc15'
  return '#f87171'
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

/** 带悬浮提示的指标标题 */
function MetricLabel({ label, metricKey }: { label: string; metricKey: string }) {
  const [show, setShow] = useState(false)
  const desc = metricDescriptions[metricKey]

  return (
    <span
      className="text-white/70 relative cursor-help border-b border-dashed border-white/30"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {label}
      {show && desc && (
        <span
          className="absolute z-50 left-0 bottom-full mb-2 w-52 rounded-lg bg-slate-800/95 backdrop-blur-md border border-white/15 text-white/90 text-xs leading-relaxed px-3 py-2 shadow-xl pointer-events-none"
        >
          {desc}
        </span>
      )}
    </span>
  )
}

export function PerformancePanel({ position = 'bottom-left' }: PerformancePanelProps) {
  const [expanded, setExpanded] = useState(true)

  // Fine-grained selectors - subscribe to individual fields
  const fps = usePerformanceStore((state) => state.fps)
  const factor = usePerformanceStore((state) => state.factor)
  const refreshrate = usePerformanceStore((state) => state.refreshrate)
  const status = usePerformanceStore((state) => state.status)
  const flipped = usePerformanceStore((state) => state.flipped)
  const drawCalls = usePerformanceStore((state) => state.drawCalls)
  const triangles = usePerformanceStore((state) => state.triangles)

  const fpsColor = getFpsColor(fps)
  const statusColor = statusColors[status]
  const progressPercent = Math.round(factor * 100)
  const drawCallColor = getDrawCallColor(drawCalls)

  return (
    <div
      className="absolute z-[1000] pointer-events-auto"
      style={positionStyles[position]}
    >
      <div
        className={`bg-slate-900/75 backdrop-blur-xl border border-white/10 rounded-xl text-white text-[13px] transition-all duration-200 ${expanded ? 'p-3 px-4 min-w-[200px]' : 'p-2 px-3'}`}
      >
        {/* 标题栏 & 折叠按钮 */}
        <div
          className={`flex items-center justify-between gap-3 ${expanded ? 'mb-3' : ''}`}
        >
          {expanded ? (
            <span className="font-semibold">
              性能监控
            </span>
          ) : (
            <span className="font-semibold">
              性能
            </span>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="bg-transparent border-none text-white/70 cursor-pointer p-0.5 flex items-center justify-center transition-colors duration-200 hover:text-white"
          >
            {expanded ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </button>
        </div>

        {expanded ? (
          <div className="flex flex-col gap-2.5">
            {/* 帧率 */}
            <div className="flex items-center justify-between">
              <MetricLabel label="帧率" metricKey="fps" />
              <span
                className="font-mono font-semibold transition-colors duration-300"
                style={{ color: fpsColor }}
              >
                {fps.toFixed(0)}
              </span>
            </div>

            {/* 性能因子进度条 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <MetricLabel label="性能因子" metricKey="factor" />
                <span className="font-mono text-white/90">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%`, background: statusColor }}
                />
              </div>
            </div>

            {/* 状态 */}
            <div className="flex items-center justify-between">
              <MetricLabel label="状态" metricKey="status" />
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full transition-colors duration-300"
                  style={{ background: statusColor }}
                />
                <span
                  className="font-mono font-medium transition-colors duration-300"
                  style={{ color: statusColor }}
                >
                  {statusLabels[status]}
                </span>
              </div>
            </div>

            {/* 刷新率 */}
            <div className="flex items-center justify-between">
              <MetricLabel label="刷新率" metricKey="refresh" />
              <span className="font-mono text-white/90">{refreshrate} Hz</span>
            </div>

            {/* 分隔线 */}
            <div className="border-t border-white/10" />

            {/* Draw Calls */}
            <div className="flex items-center justify-between">
              <MetricLabel label="Draw Calls" metricKey="drawCalls" />
              <span
                className="font-mono font-semibold transition-colors duration-300"
                style={{ color: drawCallColor }}
              >
                {drawCalls}
              </span>
            </div>

            {/* 三角面数 */}
            <div className="flex items-center justify-between">
              <MetricLabel label="三角面" metricKey="triangles" />
              <span className="font-mono text-white/90">{formatNumber(triangles)}</span>
            </div>

            {/* 抖动次数（仅 > 0 时显示） */}
            {flipped > 0 && (
              <div className="flex items-center justify-between">
                <MetricLabel label="抖动" metricKey="flips" />
                <span className="font-mono font-semibold text-yellow-400">
                  {flipped}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* 折叠视图 - 仅显示帧率 */
          <div className="flex items-center gap-2">
            <span
              className="font-mono font-semibold text-sm transition-colors duration-300"
              style={{ color: fpsColor }}
            >
              {fps.toFixed(0)}
            </span>
            <span className="text-white/50 text-[11px]">FPS</span>
          </div>
        )}
      </div>
    </div>
  )
}
