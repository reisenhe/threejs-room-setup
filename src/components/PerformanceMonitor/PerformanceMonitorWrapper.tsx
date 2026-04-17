import { useRef } from 'react'
import { PerformanceMonitor, usePerformanceMonitor } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { usePerformanceStore } from '../../store/usePerformanceStore'

/** PerformanceMonitor 回调参数类型 */
type PerfMonitorApi = {
  fps: number
  factor: number
  refreshrate: number
  flipped: number
  fallback: boolean
}

/** 每 0.5 秒采样一次 renderer.info，写入 store */
function RendererInfoTracker() {
  const gl = useThree((s) => s.gl)
  const lastSampleTime = useRef(0)

  useFrame((state) => {
    const now = state.clock.elapsedTime
    if (now - lastSampleTime.current >= 0.5) {
      lastSampleTime.current = now
      const info = gl.info.render
      usePerformanceStore.getState().updateRendererInfo({
        drawCalls: info.calls,
        triangles: info.triangles,
      })
    }
  })

  return null
}

interface PerformanceMonitorWrapperProps {
  ms?: number
  iterations?: number
  threshold?: number
  bounds?: (refreshrate: number) => [number, number]
  flipflops?: number
  step?: number
  children: React.ReactNode
}

const defaultBounds = (refreshrate: number): [number, number] => {
  return refreshrate > 100 ? [60, 100] : [40, 60]
}

export function PerformanceMonitorWrapper({
  ms = 250,
  iterations = 10,
  threshold = 0.75,
  bounds = defaultBounds,
  flipflops = 3,
  step = 0.1,
  children,
}: PerformanceMonitorWrapperProps) {
  const handleMetrics = (api: PerfMonitorApi) => {
    usePerformanceStore.getState().updateMetrics(api)
  }

  const handleFallback = () => {
    usePerformanceStore.getState().setStatus('unstable')
  }

  return (
    <PerformanceMonitor
      ms={ms}
      iterations={iterations}
      threshold={threshold}
      bounds={bounds}
      flipflops={flipflops}
      step={step}
      onIncline={handleMetrics}
      onDecline={handleMetrics}
      onChange={handleMetrics}
      onFallback={handleFallback}
    >
      <RendererInfoTracker />
      {children}
    </PerformanceMonitor>
  )
}

export { usePerformanceMonitor }
