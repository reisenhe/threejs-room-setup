import { useState, useMemo, useCallback } from 'react'
import * as THREE from 'three'

// ============================================================
// usePerformanceMode - 渲染性能模式管理 Hook
// ============================================================

/** 性能模式 */
export type PerformanceMode = 'standard' | 'optimized'

/** 性能模式配置 */
export interface PerformanceModeConfig {
  /** 设备像素比范围 */
  dpr: [number, number]
  /** 是否启用阴影 */
  shadows: boolean
  /** 材质质量 */
  materialQuality: 'high' | 'low'
}

/** Hook 返回结果 */
export interface UsePerformanceModeResult {
  /** 当前模式 */
  mode: PerformanceMode
  /** 切换模式 */
  toggleMode: () => void
  /** 设置指定模式 */
  setMode: (mode: PerformanceMode) => void
  /** 当前模式对应的配置 */
  config: PerformanceModeConfig
}

// 模式对应的配置映射
const MODE_CONFIGS: Record<PerformanceMode, PerformanceModeConfig> = {
  standard: {
    dpr: [1, 2],
    shadows: true,
    materialQuality: 'high',
  },
  optimized: {
    dpr: [0.5, 1],
    shadows: false,
    materialQuality: 'low',
  },
}

/**
 * 渲染性能模式管理 Hook
 * - 提供 standard / optimized 两种模式
 * - 根据模式计算对应的渲染配置（dpr、阴影、材质质量）
 * - 提供切换和设置模式的方法
 *
 * @param initialMode 初始模式，默认 'standard'
 */
export function usePerformanceMode(
  initialMode: PerformanceMode = 'standard'
): UsePerformanceModeResult {
  const [mode, setModeState] = useState<PerformanceMode>(initialMode)

  // 根据当前模式计算配置
  const config = useMemo<PerformanceModeConfig>(() => {
    return MODE_CONFIGS[mode]
  }, [mode])

  // 切换模式
  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === 'standard' ? 'optimized' : 'standard'))
  }, [])

  // 设置指定模式
  const setMode = useCallback((newMode: PerformanceMode) => {
    setModeState(newMode)
  }, [])

  return {
    mode,
    toggleMode,
    setMode,
    config,
  }
}

// ============================================================
// applyOptimizations - 根据配置优化场景材质的工具函数
// ============================================================

// 用 WeakMap 缓存原始材质，支持可逆切换
const originalMaterialCache = new WeakMap<
  THREE.Mesh,
  THREE.Material | THREE.Material[]
>()

/**
 * 根据性能配置优化场景中的材质
 * - 遍历 scene.traverse，根据 materialQuality 简化材质
 * - 不修改原始材质，而是 clone 后修改（可逆切换）
 * - 切换回 high 质量时恢复原始材质
 *
 * @param scene 需要优化的场景对象
 * @param config 性能模式配置
 */
export function applyOptimizations(
  scene: THREE.Object3D,
  config: PerformanceModeConfig
): void {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return

    if (config.materialQuality === 'low') {
      // 低质量模式：缓存原始材质，使用简化的 clone 材质
      if (!originalMaterialCache.has(child)) {
        originalMaterialCache.set(child, child.material)
      }

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]

      const optimizedMaterials = materials.map((mat) => {
        const cloned = mat.clone()

        if (cloned instanceof THREE.MeshStandardMaterial) {
          // 降低粗糙度计算复杂度
          cloned.roughness = 1.0
          cloned.metalness = 0.0
          // 移除法线贴图（减少纹理采样）
          if (cloned.normalMap) {
            cloned.normalMap = null
            cloned.needsUpdate = true
          }
          // 移除环境光遮蔽贴图
          if (cloned.aoMap) {
            cloned.aoMap = null
            cloned.needsUpdate = true
          }
          // 移除位移贴图
          if (cloned.displacementMap) {
            cloned.displacementMap = null
            cloned.needsUpdate = true
          }
          // 移除环境贴图（跳过透明/玻璃材质，PBR 透明材质依赖 envMap 才能正确显示）
          const isGlassMaterial = cloned.transparent && cloned.opacity < 0.95
          if (cloned.envMap && !isGlassMaterial) {
            cloned.envMap = null
            cloned.needsUpdate = true
          }
          cloned.needsUpdate = true
        }

        return cloned
      })

      child.material = Array.isArray(child.material)
        ? optimizedMaterials
        : optimizedMaterials[0]
    } else {
      // 高质量模式：恢复原始材质
      const original = originalMaterialCache.get(child)
      if (original) {
        // 先 dispose 优化过的 clone 材质
        const currentMaterials = Array.isArray(child.material)
          ? child.material
          : [child.material]
        currentMaterials.forEach((mat) => mat?.dispose())

        child.material = original
        originalMaterialCache.delete(child)
      }
    }
  })
}
