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
        style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
      />
    )
  }

  return (
    <Canvas
      camera={{ position: model.cameraPosition, fov: 50 }}
      style={{ width: '100%', height: '160px', borderRadius: '8px' }}
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
    <div style={{ display: 'flex', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Left Sidebar - Model List */}
      <div
        style={{
          width: '320px',
          backgroundColor: '#f0f2f5',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 16px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          <h2 style={{ margin: 0, color: '#1f2937', fontSize: '1.25rem', fontWeight: 600 }}>
            模型列表
          </h2>
        </div>

        {/* Scrollable Model Cards */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {modelRegistry.map((model) => {
            const isSelected = model.id === selectedId
            return (
              <div
                key={model.id}
                onClick={() => setSelectedId(model.id)}
                style={{
                  backgroundColor: isSelected ? 'rgba(74, 144, 217, 0.12)' : '#ffffff',
                  border: `2px solid ${isSelected ? '#4a90d9' : 'transparent'}`,
                  borderRadius: '12px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Thumbnail */}
                <div style={{ marginBottom: '10px', overflow: 'hidden', borderRadius: '8px' }}>
                  <ModelThumbnail model={model} />
                </div>
                
                {/* Model Info */}
                <div style={{ color: '#1f2937' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                    {model.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.4 }}>
                    {model.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Area - 3D Preview + Controls */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#e8eaed',
          overflow: 'hidden',
        }}
      >
        {/* Top - Breadcrumb Info */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>模型预览</span>
          <span style={{ color: '#9ca3af' }}>/</span>
          <span style={{ color: '#1f2937', fontSize: '0.95rem', fontWeight: 500 }}>
            {selectedModel.name}
          </span>
        </div>

        {/* Center - Large Canvas */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <Canvas
            key={selectedId}
            shadows
            camera={{ position: selectedModel.cameraPosition, fov: 50, near: 0.1, far: 100 }}
            style={{ height: '100%' }}
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

            {/* Controls */}
            <OrbitControls
              enableDamping
              dampingFactor={0.08}
              minPolarAngle={0.1}
              maxPolarAngle={Math.PI / 2 - 0.05}
              minDistance={0.5}
              maxDistance={30}
              target={selectedModel.cameraTarget}
            />

            {/* Scene content */}
            <selectedModel.Component />
            <SceneCapture onSceneReady={handleSceneReady} />
          </Canvas>
        </div>

        {/* Bottom Control Bar */}
        <div
          style={{
            height: '80px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
          }}
        >
          {/* Back Link */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: '#6b7280',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#1f2937'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            <span>←</span>
            <span>返回首页</span>
          </Link>

          {/* Status Text */}
          <div
            style={{
              color: getStatusColor(),
              fontSize: '0.95rem',
              fontWeight: 500,
              transition: 'color 0.3s ease',
            }}
          >
            {getStatusText()}
          </div>

          {/* Export Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleExportGLTF}
              disabled={isDisabled}
              style={{
                padding: '10px 24px',
                backgroundColor: isDisabled ? '#374151' : '#4a90d9',
                color: isDisabled ? '#6b7280' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isDisabled ? 'none' : '0 4px 12px rgba(74, 144, 217, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.backgroundColor = '#3a7bc8'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.backgroundColor = '#4a90d9'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              导出 GLTF
            </button>
            <button
              onClick={handleExportGLB}
              disabled={isDisabled}
              style={{
                padding: '10px 24px',
                backgroundColor: isDisabled ? '#374151' : '#4a90d9',
                color: isDisabled ? '#6b7280' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isDisabled ? 'none' : '0 4px 12px rgba(74, 144, 217, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.backgroundColor = '#3a7bc8'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.backgroundColor = '#4a90d9'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              导出 GLB
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
