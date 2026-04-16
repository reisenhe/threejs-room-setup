import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useClinicStore } from '../store/useClinicStore'

// 预设点位配置
const PRESETS = {
  overview: {
    position: new Vector3(20, 18, 20),
    target: new Vector3(7, 3, 0),
  },
  floor1: {
    position: new Vector3(5, 4, 12),
    target: new Vector3(0, 1.5, 0),
  },
  // autoRotate 不需要特定位置，只需在当前位置启用自动旋转
}

interface CameraControllerProps {
  controlsRef: React.RefObject<any>  // OrbitControls ref
}

export default function CameraController({ controlsRef }: CameraControllerProps) {
  const { camera } = useThree()
  // 细粒度 selector
  const cameraPreset = useClinicStore((s) => s.cameraPreset)
  const setCameraPreset = useClinicStore((s) => s.setCameraPreset)
  const isTransitioning = useRef(false)
  const targetPosition = useRef(new Vector3())
  const targetLookAt = useRef(new Vector3())
  const transitionSpeed = 3 // lerp speed

  // 当 preset 变化时，设置目标位置
  useEffect(() => {
    if (cameraPreset === 'free') {
      isTransitioning.current = false
      if (controlsRef.current) {
        controlsRef.current.autoRotate = false
      }
      return
    }

    if (cameraPreset === 'autoRotate') {
      isTransitioning.current = false
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true
        controlsRef.current.autoRotateSpeed = 0.5
      }
      return
    }

    // floor1 or overview
    const preset = PRESETS[cameraPreset as keyof typeof PRESETS]
    if (preset) {
      targetPosition.current.copy(preset.position)
      targetLookAt.current.copy(preset.target)
      isTransitioning.current = true
      if (controlsRef.current) {
        controlsRef.current.autoRotate = false
      }
    }
  }, [cameraPreset, controlsRef])

  // 平滑过渡
  useFrame((_, delta) => {
    if (isTransitioning.current) {
      camera.position.lerp(targetPosition.current, delta * transitionSpeed)
      if (controlsRef.current) {
        const currentTarget = controlsRef.current.target as Vector3
        currentTarget.lerp(targetLookAt.current, delta * transitionSpeed)
        controlsRef.current.update()
      }

      // 接近目标时停止过渡
      if (camera.position.distanceTo(targetPosition.current) < 0.05) {
        camera.position.copy(targetPosition.current)
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetLookAt.current)
          controlsRef.current.update()
        }
        isTransitioning.current = false
      }
    }
  })

  // 监听用户鼠标操作，自动恢复 free 模式
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    
    const handleStart = () => {
      // 用户开始操作时，退出预设模式
      if (useClinicStore.getState().cameraPreset !== 'free') {
        setCameraPreset('free')
        controls.autoRotate = false
        isTransitioning.current = false
      }
    }
    
    controls.addEventListener('start', handleStart)
    return () => {
      controls.removeEventListener('start', handleStart)
    }
  }, [controlsRef, setCameraPreset])

  return null // 不渲染任何内容
}
