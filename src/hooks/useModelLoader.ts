import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

// ============================================================
// useModelLoader - 使用 GLTFLoader / DRACOLoader 的模型加载 Hook（Suspense 模式）
// ============================================================

/** 加载选项 */
export interface UseModelLoaderOptions {
  /** true 使用本地 Draco decoder（public/draco/gltf/），string 自定义 decoder 路径 */
  draco?: boolean | string
  /**
   * true 将相同材质的 Mesh 合并为单个 draw call，可大幅降低 draw call 数量。
   * 注意：合并后场景结构被展平，原始节点层级、名称、userData 均不保留。
   * 多材质（material 数组）的 Mesh 会跳过合并，保持原样。
   */
  mergeMaterials?: boolean
}

/** 返回结果 */
export interface UseModelLoaderResult {
  /** 模型场景（已 clone，安全多组件复用） */
  scene: THREE.Group
  /** 模型动画片段 */
  animations: THREE.AnimationClip[]
}

// 本地 Draco decoder 路径（对应 public/draco/gltf/ 目录）
const DEFAULT_DRACO_PATH = '/draco/gltf/'

// ---------- Suspense 缓存 ----------
// 使用 Map 缓存 promise 和结果，以支持 React Suspense 模式
const cache = new Map<string, { promise: Promise<GLTF>; result?: GLTF; error?: unknown }>()

/** 创建共享的 DRACOLoader 单例 */
let sharedDracoLoader: DRACOLoader | null = null
function getDracoLoader(decoderPath: string): DRACOLoader {
  if (!sharedDracoLoader) {
    sharedDracoLoader = new DRACOLoader()
  }
  sharedDracoLoader.setDecoderPath(decoderPath)
  return sharedDracoLoader
}

/**
 * 将场景中相同材质的 Mesh 合并为单个 Mesh，降低 draw call。
 * - 每个 Mesh 的世界矩阵已 bake 到几何体顶点，合并后 Mesh 置于场景原点。
 * - 多材质（material 数组）的 Mesh 直接加入结果，不参与合并。
 * - 合并失败时静默跳过对应分组。
 */
function mergeSceneByMaterial(scene: THREE.Group): THREE.Group {
  scene.updateMatrixWorld(true)

  const buckets = new Map<
    string,
    { material: THREE.Material; geoms: THREE.BufferGeometry[] }
  >()
  const skipped: THREE.Mesh[] = []

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return

    // 多材质 Mesh 跳过合并
    if (Array.isArray(child.material)) {
      skipped.push(child)
      return
    }

    const mat = child.material as THREE.Material
    const geom = child.geometry.clone() as THREE.BufferGeometry
    geom.applyMatrix4(child.matrixWorld)

    // 分桶 key = 材质 uuid + geometry attributes 指纹
    // 只有材质相同且 attribute 集合完全一致的几何体才进同一桶，
    // 避免 mergeGeometries 因 attribute 数量不匹配而报错
    const attrKey = Object.keys(geom.attributes).sort().join(',')
    const bucketKey = `${mat.uuid}|${attrKey}`

    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, { material: mat, geoms: [] })
    }
    buckets.get(bucketKey)!.geoms.push(geom)
  })

  const result = new THREE.Group()

  buckets.forEach(({ material, geoms }) => {
    if (geoms.length === 1) {
      result.add(new THREE.Mesh(geoms[0], material))
      return
    }
    const merged = mergeGeometries(geoms, false)
    // 释放中间克隆的几何体
    geoms.forEach((g) => g.dispose())
    if (merged) {
      result.add(new THREE.Mesh(merged, material))
    }
  })

  // 多材质 Mesh 保持原样加入结果
  skipped.forEach((mesh) => {
    const clone = mesh.clone()
    result.add(clone)
  })

  return result
}

/** 发起或复用 GLTF 加载请求（Suspense 兼容） */
function loadGLTF(url: string, dracoPath?: string): GLTF {
  const key = url

  if (!cache.has(key)) {
    const loader = new GLTFLoader()
    if (dracoPath) {
      loader.setDRACOLoader(getDracoLoader(dracoPath))
    }

    const promise = new Promise<GLTF>((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          const entry = cache.get(key)!
          entry.result = gltf
          resolve(gltf)
        },
        undefined,
        (err) => {
          const entry = cache.get(key)!
          entry.error = err
          reject(err)
        },
      )
    })

    cache.set(key, { promise })
  }

  const entry = cache.get(key)!

  // 有错误则抛出
  if (entry.error) throw entry.error
  // 结果就绪则返回
  if (entry.result) return entry.result
  // 仍在加载中 — 抛出 promise 让 Suspense 捕获
  throw entry.promise
}

/**
 * 模型加载 Hook（Suspense 模式）
 * - 使用 three/examples/jsm 的 GLTFLoader + DRACOLoader 加载 GLTF/GLB 模型
 * - Draco decoder 使用本地文件（public/draco/gltf/），不依赖 CDN
 * - useMemo 缓存 scene clone，避免多组件共享同一实例
 * - 组件卸载时 dispose 释放资源
 *
 * 注意：使用 Suspense 模式，加载期间组件会被挂起，
 * 组件渲染即代表数据已就绪，无需 isLoaded 状态判断。
 *
 * @param url 模型文件路径
 * @param options 加载选项
 */
export function useModelLoader(
  url: string,
  options: UseModelLoaderOptions = {}
): UseModelLoaderResult {
  const { draco = false, mergeMaterials = false } = options

  // 计算 Draco decoder 路径
  const dracoPath = useMemo(() => {
    if (draco === true) return DEFAULT_DRACO_PATH
    if (typeof draco === 'string') return draco
    return undefined
  }, [draco])

  // 通过 Suspense 兼容的 loadGLTF 获取结果（加载中会 throw promise）
  const gltf = loadGLTF(url, dracoPath)

  // useMemo 缓存 scene clone，避免多组件共享同一 scene 实例
  // 如果启用 mergeMaterials，则在 clone 后合并相同材质的 Mesh
  const clonedScene = useMemo(() => {
    const base = gltf.scene.clone(true)
    return mergeMaterials ? mergeSceneByMaterial(base) : base
  }, [gltf.scene, mergeMaterials])

  // 组件卸载时清理 clone 出来的场景资源
  // 注意：clone(true) 的纹理(Texture)与原始 gltf.scene 共享引用，
  // 因此只 dispose 几何体和材质本身，不释放纹理，避免破坏缓存的原始资源
  useEffect(() => {
    return () => {
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // 释放几何体
          child.geometry?.dispose()
          // 释放材质（不释放纹理，因为与原始场景共享）
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material]
          materials.forEach((mat) => {
            mat?.dispose()
          })
        }
      })
    }
  }, [clonedScene])

  return {
    scene: clonedScene,
    animations: gltf.animations || [],
  }
}
