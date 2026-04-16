import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useModelLoader } from '../../hooks/useModelLoader'
import { useAnimationPlayer, type UseAnimationPlayerResult } from '../../hooks/useAnimationPlayer'
import { applyOptimizations, type PerformanceModeConfig } from '../../hooks/usePerformanceMode'

// ============================================================
// CarModel - BMW M4 GLTF 模型 3D 组件
// 必须在 <Canvas> 内部、<Suspense> 内部渲染
// ============================================================

/** 模型文件路径（public 目录下） */
const MODEL_PATH = '/models/2021_bmw_m4_competition/scene.gltf'

/** 组件 Props */
export interface CarModelProps {
  /** 性能模式配置 */
  perfConfig: PerformanceModeConfig
  /** 动画是否正在播放 */
  animPlaying: boolean
  /** 动画播放速度 */
  animSpeed: number
  /** 动画是否循环 */
  animLoop: boolean
  /** 加载完成回调 */
  onLoaded?: () => void
  /** 动画控制器就绪回调（传递 player 给父组件） */
  onAnimReady?: (player: UseAnimationPlayerResult) => void
}

export default function CarModel({
  perfConfig,
  animPlaying,
  animSpeed,
  animLoop,
  onLoaded,
  onAnimReady,
}: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null)

  // 加载 GLTF 模型（启用 Draco 解码）— Suspense 模式，渲染即加载完成
  const { scene, animations } = useModelLoader(MODEL_PATH, {
    draco: true,
  })

  // 动画控制
  const animPlayer = useAnimationPlayer(animations, groupRef)

  // 加载完成通知（组件渲染即代表加载完成）
  useEffect(() => {
    onLoaded?.()
  }, [onLoaded])

  // 动画控制器就绪后传递给父组件
  useEffect(() => {
    if (animations.length > 0) {
      onAnimReady?.(animPlayer)
    }
  }, [animations.length, onAnimReady, animPlayer])

  // 同步外部动画播放状态
  useEffect(() => {
    if (animPlaying) {
      animPlayer.play()
    } else {
      animPlayer.pause()
    }
  }, [animPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  // 同步速度
  useEffect(() => {
    animPlayer.setSpeed(animSpeed)
  }, [animSpeed]) // eslint-disable-line react-hooks/exhaustive-deps

  // 同步循环
  useEffect(() => {
    animPlayer.setLoop(animLoop)
  }, [animLoop]) // eslint-disable-line react-hooks/exhaustive-deps

  // 模型居中与缩放（useMemo 缓存计算结果）
  const { position, scale } = useMemo(() => {
    if (!scene || scene.children.length === 0) {
      return { position: new THREE.Vector3(), scale: 1 }
    }

    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    // 目标尺寸：模型最大维度归一化到约 80 units（适合当前相机距离）
    const maxDim = Math.max(size.x, size.y, size.z)
    const targetScale = maxDim > 0 ? 80 / maxDim : 1
    const offsetY = size.y * 0.5

    return {
      position: center.multiplyScalar(-1).add(new THREE.Vector3(0, offsetY, 0)), // 平移到原点并调整 Y 轴
      scale: targetScale,
    }
  }, [scene])

  // 应用性能优化（材质简化/恢复）
  useEffect(() => {
    if (!scene) return
    applyOptimizations(scene, perfConfig)
  }, [perfConfig, scene])

  // 设置阴影
  useEffect(() => {
    if (!scene) return
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = perfConfig.shadows
        child.receiveShadow = perfConfig.shadows
      }
    })
  }, [scene, perfConfig.shadows])

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={scene} position={position} />
    </group>
  )
}
