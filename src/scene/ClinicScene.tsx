import { useRef, useEffect } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { Grid, OrbitControls } from '@react-three/drei'
import { EffectComposer, Outline } from '@react-three/postprocessing'
import { Group, Mesh, MeshStandardMaterial, MathUtils, PCFShadowMap } from 'three'
import Room from '../components/Room/Room'
import { useClinicStore } from '../store/useClinicStore'
import CameraController from './CameraController'
import { PerformanceMonitorWrapper } from '../components/PerformanceMonitor'

// 房间配置数组
const ROOMS = [
  { id: 1, name: '1F 诊室', position: [0, 0, 0] as const, hasDoor: true },
  { id: 2, name: '2F 诊室', position: [0, 3.12, 0] as const, hasDoor: false },
  { id: 3, name: '3F 诊室', position: [0, 6.24, 0] as const, hasDoor: false },
  { id: 4, name: '侧翼诊室', position: [14, 0, 0] as const, hasDoor: true },
]

// RoomInstance 组件
function RoomInstance({
  roomId,
  position,
  hasDoor,
}: {
  roomId: number
  position: [number, number, number]
  hasDoor: boolean
}) {
  // 细粒度 selector，避免任意 state 变化触发重渲染
  const selectedRoomId = useClinicStore((s) => s.selectedRoomId)
  const selectRoom = useClinicStore((s) => s.selectRoom)
  const flashRoomId = useClinicStore((s) => s.flashRoomId)
  const clearFlash = useClinicStore((s) => s.clearFlash)
  const setHoveredMesh = useClinicStore((s) => s.setHoveredMesh)

  const groupRef = useRef<Group>(null)
  const flashStartTime = useRef<number | null>(null)

  const isSelected = selectedRoomId === roomId
  const isOther = selectedRoomId !== null && !isSelected
  const showCeiling = !isSelected // 选中时隐藏天花板

  // 淡出效果：isOther 时将所有子 mesh 材质 opacity 渐变到 0.1
  const targetOpacity = useRef(1)
  const currentOpacity = useRef(1)

  useEffect(() => {
    targetOpacity.current = isOther ? 0.1 : 1
  }, [isOther])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // 平滑过渡 opacity
    currentOpacity.current = MathUtils.lerp(
      currentOpacity.current,
      targetOpacity.current,
      delta * 5
    )

    // 计算 flash emissive 强度
    let emissiveR = 0
    const isFlashing = flashRoomId === roomId
    if (isFlashing) {
      if (flashStartTime.current === null) {
        flashStartTime.current = state.clock.elapsedTime
      }
      const elapsed = state.clock.elapsedTime - flashStartTime.current
      if (elapsed < 2) {
        emissiveR = Math.max(0, Math.sin(elapsed * 10)) * 0.5
      } else {
        flashStartTime.current = null
        clearFlash()
      }
    } else if (flashStartTime.current !== null) {
      flashStartTime.current = null
    }

    // 单次 traverse 同时设置 opacity 和 emissive，避免多次遍历
    groupRef.current.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mat = (child as Mesh).material as MeshStandardMaterial
        mat.transparent = true
        mat.opacity = currentOpacity.current
        mat.emissive.setRGB(emissiveR, 0, 0)
        
        child.castShadow = !isOther
        child.receiveShadow = !isOther
      }
    })
  })

  // 悬浮高亮：在 group 上监听 pointer 事件
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (!isOther) setHoveredMesh(e.object)
  }
  const handlePointerOut = () => setHoveredMesh(null)

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        selectRoom(roomId);
      }}
      onContextMenu={(e) => {
        e.stopPropagation()
        selectRoom(null)
      }}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <Room hasDoor={hasDoor} showCeiling={showCeiling} />
    </group>
  )
}

// 带辅助线的平行光组件
// target：光源照射目标点，默认指向场景中心 [7, 3, 0]
function SceneDirectionalLight({
  position = [10, 20, 10] as [number, number, number],
  target = [7, 3, 0] as [number, number, number],
}) {
  const lightRef = useRef<any>(null)
  const targetRef = useRef<any>(null)
  const shadowCamRef = useRef<any>(null)
  // const [shadowReady, setShadowReady] = useState(false)

  // 使用 useHelper 显示光源和阴影相机的辅助线
  // useHelper(lightRef, DirectionalLightHelper, 2, '#ffaa00') // 显示光源辅助线
  // useHelper(shadowReady ? shadowCamRef : null, CameraHelper)

  // 将 target 节点赋给 light.target，并在 mount 后初始化 shadow camera ref
  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current
    }
    if (lightRef.current?.shadow?.camera) {
      shadowCamRef.current = lightRef.current.shadow.camera
      // setShadowReady(true)
    }
  }, [])

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={position}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
      />
      {/* 光照目标点，必须作为独立场景节点才能被 light.target 正确引用 */}
      <object3D ref={targetRef} position={target} />
    </>
  )
}

// ClinicScene 主体组件
export default function ClinicScene() {
  const hoveredMesh = useClinicStore((s) => s.hoveredMesh)
  const controlsRef = useRef<any>(null)

  return (
    <Canvas
      shadows={{ type: PCFShadowMap }}
      camera={{ position: [20, 18, 20], fov: 50, near: 0.1, far: 200 }}
    >
      <PerformanceMonitorWrapper>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <SceneDirectionalLight position={[10, 20, 10]} target={[7, 3, 0]} />
        <hemisphereLight args={['#b1e1ff', '#b97a20', 0.25]} />

        {/* Controls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={3}
          maxDistance={60}
          target={[7, 3, 0]}
        />

        <CameraController controlsRef={controlsRef} />
        <Grid
          args={[50, 50]}
          position={[0, -0.001, 0]}
          cellSize={5}
          cellThickness={0.5}
          cellColor="#e2e8f0"
          sectionSize={50}
          sectionThickness={1}
          sectionColor="#94a3b8"
          fadeDistance={400}
          fadeStrength={1}
          followCamera={false}
        />
        {/* Scene content - 4个房间 */}
        {ROOMS.map((room) => (
          <RoomInstance
            key={room.id}
            roomId={room.id}
            position={[...room.position] as [number, number, number]}
            hasDoor={room.hasDoor}
          />
        ))}

        {/* Outline 高亮效果 */}
        <EffectComposer>
          <Outline
            selection={hoveredMesh ? [hoveredMesh] : []}
            edgeStrength={3}
            pulseSpeed={0}
            visibleEdgeColor={0xffffff}
            hiddenEdgeColor={0xffffff}
            blur
          />
        </EffectComposer>
      </PerformanceMonitorWrapper>
    </Canvas>
  )
}
