import { useRef } from 'react'
import { PerformanceMonitor, usePerformanceMonitor } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { usePerformanceStore } from '../../store/usePerformanceStore'

/** 每 30 帧采样一次 renderer.info，写入 store */
function RendererInfoTracker() {
  const gl = useThree((s) => s.gl)
  const frameCount = useRef(0)

  useFrame(() => {
    frameCount.current++
    if (frameCount.current % 30 === 0) {
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
  const handleIncline = (api: {
    fps: number
    factor: number
    refreshrate: number
    flipped: number
    fallback: boolean
  }) => {
    usePerformanceStore.getState().updateMetrics(api)
  }

  const handleDecline = (api: {
    fps: number
    factor: number
    refreshrate: number
    flipped: number
    fallback: boolean
  }) => {
    usePerformanceStore.getState().updateMetrics(api)
  }

  const handleChange = (api: {
    fps: number
    factor: number
    refreshrate: number
    flipped: number
    fallback: boolean
  }) => {
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
      onIncline={handleIncline}
      onDecline={handleDecline}
      onChange={handleChange}
      onFallback={handleFallback}
    >
      <RendererInfoTracker />
      {children}
    </PerformanceMonitor>
  )
}

export { usePerformanceMonitor }
