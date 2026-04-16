import { useState, useCallback, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Link } from 'react-router-dom'
import { Scene } from 'three'
import { modelRegistry, ModelEntry } from '../utils/modelRegistry'
import { exportToGLTF, exportToGLB } from '../utils/gltfExporter'

interface SceneCaptureProps {
  onSceneReady: (scene: Scene) => void
}

function SceneCapture({ onSceneReady }: SceneCaptureProps) {
  const { scene } = useThree()

  useEffect(() => {
    if (scene) {
      onSceneReady(scene)
    }
  }, [scene, onSceneReady])

  return null
}

function ScreenshotCapture({ onCapture }: { onCapture: (url: string) => void }) {
  const { gl, scene, camera } = useThree()
  const captured = useRef(false)

  useEffect(() => {
    // Wait a short delay for the scene to fully render, then capture
    const timer = setTimeout(() => {
      if (!captured.current) {
        captured.current = true
        gl.render(scene, camera)
        const dataUrl = gl.domElement.toDataURL('image/png')
        onCapture(dataUrl)
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [gl, scene, camera, onCapture])

  return null
}

function ModelThumbnail({ model }: { model: ModelEntry }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const ModelComponent = model.Component

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={model.name}
        className="w-full h-[160px] object-cover rounded-lg block"
      />
    )
  }

  return (
    <Canvas
      camera={{ position: model.cameraPosition, fov: 50 }}
      className="w-full h-[160px] rounded-lg"
      gl={{ preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 3]} intensity={0.8} />
      <ModelComponent />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        target={model.cameraTarget}
      />
      <ScreenshotCapture onCapture={setImageUrl} />
    </Canvas>
  )
}

function ModelRenderer({
  model,
  onSceneReady,
}: {
  model: ModelEntry
  onSceneReady: (scene: Scene) => void
}) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(...model.cameraPosition)
    camera.updateProjectionMatrix()
  }, [camera, model.cameraPosition])

  const ModelComponent = model.Component

  return (
    <>
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={0.5}
        maxDistance={30}
        target={model.cameraTarget}
      />
      <ModelComponent />
      <SceneCapture onSceneReady={onSceneReady} />
    </>
  )
}

export default function ExportPage() {
  const [selectedId, setSelectedId] = useState('full-scene')
  const selectedModel = modelRegistry.find(m => m.id === selectedId)!
  
  const [sceneRef, setSceneRef] = useState<Scene | null>(null)
  const [status, setStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSceneReady = useCallback((scene: Scene) => {
    setSceneRef(scene)
  }, [])

  const handleExportGLTF = useCallback(async () => {
    if (!sceneRef) return

    setStatus('exporting')
    setErrorMsg('')

    try {
      await exportToGLTF(sceneRef, selectedModel.id)
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMsg(error instanceof Error ? error.message : '导出失败')
    }
  }, [sceneRef, selectedModel.id])

  const handleExportGLB = useCallback(async () => {
    if (!sceneRef) return

    setStatus('exporting')
    setErrorMsg('')

    try {
      await exportToGLB(sceneRef, selectedModel.id)
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMsg(error instanceof Error ? error.message : '导出失败')
    }
  }, [sceneRef, selectedModel.id])

  const isExporting = status === 'exporting'
  const isDisabled = isExporting || sceneRef === null

  const getStatusText = () => {
    switch (status) {
      case 'idle':
        return '准备就绪'
      case 'exporting':
        return '正在导出...'
      case 'success':
        return '导出成功！'
      case 'error':
        return `导出失败: ${errorMsg}`
      default:
        return ''
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return '#4ade80'
      case 'error':
        return '#f87171'
      case 'exporting':
        return '#fbbf24'
      default:
        return '#6b7280'
    }
  }

  return (
    <div className="flex h-screen font-sans">
      {/* Left Sidebar - Model List */}
      <div className="w-[320px] bg-surface flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-5 border-b border-black/[0.08]">
          <h2 className="m-0 text-dark text-xl font-semibold">
            模型列表
          </h2>
        </div>

        {/* Scrollable Model Cards */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {modelRegistry.map((model) => {
            const isSelected = model.id === selectedId
            return (
              <div
                key={model.id}
                onClick={() => setSelectedId(model.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-[rgba(74,144,217,0.12)] border-2 border-secondary'
                    : 'bg-white border-2 border-transparent'
                }`}
              >
                {/* Thumbnail */}
                <div className="mb-2.5 overflow-hidden rounded-lg">
                  <ModelThumbnail model={model} />
                </div>
                
                {/* Model Info */}
                <div className="text-dark">
                  <div className="font-semibold text-[0.95rem] mb-1">
                    {model.name}
                  </div>
                  <div className="text-[0.8rem] text-gray-500 leading-snug">
                    {model.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Area - 3D Preview + Controls */}
      <div className="flex-1 flex flex-col bg-surface-light overflow-hidden">
        {/* Top - Breadcrumb Info */}
        <div className="px-6 py-4 border-b border-black/[0.08] flex items-center gap-2">
          <span className="text-gray-500 text-[0.9rem]">模型预览</span>
          <span className="text-gray-400">/</span>
          <span className="text-dark text-[0.95rem] font-medium">
            {selectedModel.name}
          </span>
        </div>

        {/* Center - Large Canvas */}
        <div className="flex-1 min-h-0 relative">
          <Canvas
            shadows
            camera={{ position: selectedModel.cameraPosition, fov: 50, near: 0.1, far: 100 }}
            className="h-full"
          >
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[8, 15, 8]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
              shadow-camera-near={0.5}
              shadow-camera-far={50}
            />
            <hemisphereLight args={['#b1e1ff', '#b97a20', 0.25]} />

            {/* Model + Controls + SceneCapture */}
            <ModelRenderer key={selectedId} model={selectedModel} onSceneReady={handleSceneReady} />
          </Canvas>
        </div>

        {/* Bottom Control Bar */}
        <div className="h-20 bg-white border-t border-black/[0.08] flex items-center justify-between px-8">
          {/* Back Link */}
          <Link
            to="/"
            className="no-underline text-gray-500 text-base flex items-center gap-2 transition-colors duration-200 hover:text-dark"
          >
            <span>←</span>
            <span>返回首页</span>
          </Link>

          {/* Status Text */}
          <div
            className="text-[0.95rem] font-medium transition-colors duration-300"
            style={{ color: getStatusColor() }}
          >
            {getStatusText()}
          </div>

          {/* Export Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleExportGLTF}
              disabled={isDisabled}
              className={`px-6 py-2.5 rounded-lg text-[0.95rem] font-semibold transition-all duration-200 ${
                isDisabled
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none'
                  : 'bg-secondary text-white cursor-pointer shadow-lg hover:-translate-y-0.5 hover:brightness-110'
              }`}
            >
              导出 GLTF
            </button>
            <button
              onClick={handleExportGLB}
              disabled={isDisabled}
              className={`px-6 py-2.5 rounded-lg text-[0.95rem] font-semibold transition-all duration-200 ${
                isDisabled
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none'
                  : 'bg-secondary text-white cursor-pointer shadow-lg hover:-translate-y-0.5 hover:brightness-110'
              }`}
            >
              导出 GLB
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
