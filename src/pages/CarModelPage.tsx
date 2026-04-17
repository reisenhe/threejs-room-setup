import { useState, useCallback, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, useProgress, Environment } from '@react-three/drei'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { PerformanceMonitorWrapper, PerformancePanel } from '../components/PerformanceMonitor'
import { usePerformanceMode } from '../hooks/usePerformanceMode'
import type { UseAnimationPlayerResult } from '../hooks/useAnimationPlayer'
import CarModel from '../components/CarModel/CarModel'


const hdrUrl = '/environments/venice_sunset_1k.hdr'

// ============================================================
// CarModelPage - BMW M4 模型渲染页面（含双模式对比）
// ============================================================

/** 动画速度选项 */
const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const

export default function CarModelPage() {
  // 性能模式（可在 Canvas 外使用）
  const { mode, setMode, config } = usePerformanceMode()

  // 动画控件状态（由工具栏控制，通过 props 传入 Canvas 内组件）
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<number>(1)
  const [loop, setLoop] = useState(true)

  // 合并材质状态
  const [mergeMaterials, setMergeMaterials] = useState(false)

  // 动画控制器引用（由 CarModel 通过 onAnimReady 回调传入）
  const animPlayerRef = useRef<UseAnimationPlayerResult | null>(null)

  // 动画控制器就绪回调
  const handleAnimReady = useCallback((player: UseAnimationPlayerResult) => {
    animPlayerRef.current = player
  }, [])

  // 切换合并材质（开启时强制停止播放）
  const handleToggleMerge = useCallback(() => {
    setMergeMaterials((prev) => {
      if (!prev) setIsPlaying(false)
      return !prev
    })
  }, [])

  // 重置动画（回到初始帧并清除播放状态）
  const handleResetAnim = useCallback(() => {
    animPlayerRef.current?.stop()
    setIsPlaying(false)
  }, [])

  // 使用 drei 的 useProgress 获取全局加载进度（可在 Canvas 外部使用）
  const { progress, active } = useProgress()
  const [loaded, setLoaded] = useState(false)

  // 加载完成回调
  const handleLoaded = useCallback(() => {
    // 延迟隐藏加载界面，给用户一个短暂的 100% 反馈
    setTimeout(() => setLoaded(true), 300)
  }, [])

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-surface flex flex-col">
      {/* 顶部工具栏 */}
      <div className="h-14 bg-white/80 backdrop-blur-xl border-b border-black/[0.08] flex items-center justify-between px-5 z-[100] shrink-0">
        {/* 左侧：返回 + 模式切换 */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="no-underline flex items-center gap-2 text-primary font-semibold text-[0.9rem] hover:opacity-80 transition-opacity"
          >
            <svg
              width="18"
              height="18"
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
            返回首页
          </Link>

          {/* 分隔线 */}
          <div className="w-px h-6 bg-black/10" />

          {/* 合并材质切换（开启后动画不可用） */}
          <button
            onClick={handleToggleMerge}
            title={
              mergeMaterials
                ? '已合并相同材质节点为单个 draw call，点击取消'
                : '将相同材质的 Mesh 合并以降低 draw call，合并后动画不可用'
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium cursor-pointer transition-colors duration-200 ${
              mergeMaterials
                ? 'border-amber-400/50 bg-amber-50 text-amber-700'
                : 'border-black/10 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
            合并材质
          </button>

          {/* 模式切换按钮组 - 连接 usePerformanceMode */}
          <div className="flex rounded-lg overflow-hidden border border-black/10">
            <button
              onClick={() => setMode('standard')}
              className={`px-4 py-1.5 text-[13px] font-medium border-none cursor-pointer transition-colors duration-200 ${
                mode === 'standard'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              标准模式
            </button>
            <button
              onClick={() => setMode('optimized')}
              className={`px-4 py-1.5 text-[13px] font-medium border-none cursor-pointer transition-colors duration-200 ${
                mode === 'optimized'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              优化模式
            </button>
          </div>

          {/* 当前模式指示 */}
          <span className="text-[12px] text-gray-400">
            DPR: {config.dpr[0]}–{config.dpr[1]} | 阴影: {config.shadows ? '开' : '关'} | 材质: {config.materialQuality === 'high' ? '高' : '低'}
          </span>
        </div>

        {/* 右侧：动画控件 */}
        <div className="flex items-center gap-3">
          {/* 重置动画 */}
          <span title={mergeMaterials ? '已合并材质，动画不可用' : '重置动画到初始帧'}>
            <button
              onClick={handleResetAnim}
              disabled={mergeMaterials}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-colors duration-200 ${
                mergeMaterials
                  ? 'border-black/5 bg-gray-50 text-gray-300 cursor-not-allowed'
                  : 'border-black/10 bg-white text-gray-700 cursor-pointer hover:bg-gray-50'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
              </svg>
              重置
            </button>
          </span>

          {/* 播放/暂停 - 合并材质时禁用 */}
          <span title={
            mergeMaterials
              ? '已开启合并材质，动画暂不可用'
              : isPlaying ? '暂停动画' : '播放动画'
          }>
            <button
              onClick={() => !mergeMaterials && setIsPlaying((prev) => !prev)}
              disabled={mergeMaterials}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-colors duration-200 ${
                mergeMaterials
                  ? 'border-black/5 bg-gray-50 text-gray-300 cursor-not-allowed'
                  : 'border-black/10 bg-white text-gray-700 cursor-pointer hover:bg-gray-50'
              }`}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
              {isPlaying ? '暂停' : '播放'}
            </button>
          </span>

          {/* 速度选择 - 连接 animPlayer.setSpeed */}
          <div className="flex items-center gap-1">
            <span className="text-[12px] text-gray-500 mr-1">速度</span>
            {SPEED_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded text-[12px] font-mono border-none cursor-pointer transition-colors duration-200 ${
                  speed === s
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* 循环开关 - 连接 animPlayer.setLoop */}
          <button
            onClick={() => setLoop((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium cursor-pointer transition-colors duration-200 ${
              loop
                ? 'border-primary/30 bg-primary/5 text-primary'
                : 'border-black/10 bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            循环
          </button>
        </div>
      </div>

      {/* Canvas 3D 渲染区域 */}
      <div className="flex-1 min-h-0 relative">
        <Canvas
          shadows={config.shadows}
          dpr={config.dpr}
          camera={{ position: [75, 40, 75], fov: 45, near: 0.1, far: 1000 }}
          gl={{
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            outputColorSpace: THREE.SRGBColorSpace,
            antialias: true,
          }}
        >
          <PerformanceMonitorWrapper>
            {/* 三光源照明 - 参考 ClinicScene 设置 */}
            <ambientLight intensity={0.6} />
            {/* <directionalLight
              position={[100, 150, 100]}
              intensity={1.2}
              castShadow={config.shadows}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-left={-150}
              shadow-camera-right={150}
              shadow-camera-top={150}
              shadow-camera-bottom={-150}
              shadow-camera-near={0.5}
              shadow-camera-far={500}
            /> */}
            <hemisphereLight args={['#b1e1ff', '#b97a20', 0.35]} />

            {/* HDR 环境贴图 - 为 PBR 金属材质提供环境反射 */}
            <Environment files={hdrUrl} />

            {/* OrbitControls - 支持阻尼 */}
            <OrbitControls
              enableDamping
              dampingFactor={0.08}
              minPolarAngle={0.1}
              maxPolarAngle={Math.PI / 2 - 0.05}
              minDistance={50}
              maxDistance={500}
              target={[0, 0, 0]}
            />

            {/* 地面网格 */}
            <Grid
              args={[300, 300]}
              cellSize={10}
              cellThickness={0.5}
              cellColor="#e2e8f0"
              sectionSize={50}
              sectionThickness={1}
              sectionColor="#94a3b8"
              fadeDistance={400}
              fadeStrength={1}
              followCamera={false}
            />

            {/* BMW M4 模型 - 使用 Suspense 处理异步加载 */}
            {/* key 随 mergeMaterials 变化，强制组件卸载重挂，确保 AnimationMixer/actions 与新 scene 重新绑定 */}
            <Suspense fallback={null}>
              <CarModel
                key={String(mergeMaterials)}
                perfConfig={config}
                animPlaying={isPlaying}
                animSpeed={speed}
                animLoop={loop}
                mergeMaterials={mergeMaterials}
                onLoaded={handleLoaded}
                onAnimReady={handleAnimReady}
              />
            </Suspense>
          </PerformanceMonitorWrapper>
        </Canvas>

        {/* 加载进度条 overlay */}
        {(!loaded || active) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-500">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center gap-4 min-w-[280px] border border-white/20">
              <span className="text-white text-lg font-medium">模型加载中...</span>
              {/* 进度条 */}
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(progress)}%` }}
                />
              </div>
              <span className="text-white/80 text-sm font-mono">{Math.round(progress)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* 性能面板 */}
      <PerformancePanel position="bottom-left" />
    </div>
  )
}
