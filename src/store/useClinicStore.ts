import { create } from 'zustand'
import type { Object3D } from 'three'

type CameraPreset = 'free' | 'floor1' | 'overview' | 'autoRotate'

interface ClinicState {
  // 房间选中
  selectedRoomId: number | null
  selectRoom: (id: number | null) => void
  
  // 红色闪烁
  flashRoomId: number | null
  triggerFlash: (id: number) => void
  clearFlash: () => void
  
  // 悬浮高亮
  // hoveredMesh 保留在 state 中，因为 Outline 组件的 selection prop 需要触发 re-render。
  // 更新频率为指针事件级（pointerover/pointerout），非每帧级，性能可接受。
  // Zustand 默认对 set() 做浅比较，相同引用不会触发更新。
  hoveredMesh: Object3D | null
  setHoveredMesh: (mesh: Object3D | null) => void
  
  // 摄像机预设
  cameraPreset: CameraPreset
  setCameraPreset: (preset: CameraPreset) => void
}

export const useClinicStore = create<ClinicState>((set) => ({
  // 房间选中
  selectedRoomId: null,
  selectRoom: (id) => set({ selectedRoomId: id }),
  
  // 红色闪烁
  flashRoomId: null,
  triggerFlash: (id) => set({ flashRoomId: id }),
  clearFlash: () => set({ flashRoomId: null }),
  
  // 悬浮高亮
  hoveredMesh: null,
  setHoveredMesh: (mesh) => set({ hoveredMesh: mesh }),
  
  // 摄像机预设
  cameraPreset: 'overview' as CameraPreset,
  setCameraPreset: (preset) => set({ cameraPreset: preset }),
}))
