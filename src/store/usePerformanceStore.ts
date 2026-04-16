import { create } from 'zustand'

export type PerformanceStatus = 'good' | 'fair' | 'poor' | 'unstable'

interface PerformanceMetrics {
  fps: number
  factor: number
  refreshrate: number
  flipped: number
  fallback: boolean
}

interface RendererInfo {
  drawCalls: number
  triangles: number
}

interface PerformanceState {
  // State fields
  fps: number
  factor: number
  refreshrate: number
  status: PerformanceStatus
  flipped: number
  drawCalls: number
  triangles: number

  // Actions
  updateMetrics: (api: PerformanceMetrics) => void
  setStatus: (status: PerformanceStatus) => void
  updateRendererInfo: (info: RendererInfo) => void
}

export const usePerformanceStore = create<PerformanceState>((set) => ({
  // State fields
  fps: 0,
  factor: 0.5,
  refreshrate: 60,
  status: 'fair',
  flipped: 0,
  drawCalls: 0,
  triangles: 0,

  // Actions
  updateMetrics: (api) => {
    let status: PerformanceStatus

    if (api.fallback) {
      status = 'unstable'
    } else if (api.fps >= 50) {
      status = 'good'
    } else if (api.fps >= 30) {
      status = 'fair'
    } else {
      status = 'poor'
    }

    set({
      fps: api.fps,
      factor: api.factor,
      refreshrate: api.refreshrate,
      flipped: api.flipped,
      status,
    })
  },

  setStatus: (status) => set({ status }),

  updateRendererInfo: (info) =>
    set({ drawCalls: info.drawCalls, triangles: info.triangles }),
}))
