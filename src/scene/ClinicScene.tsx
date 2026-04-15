import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Room from '../components/Room/Room'

export default function ClinicScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [10, 12, 10], fov: 50, near: 0.1, far: 100 }}
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
      <hemisphereLight
        args={['#b1e1ff', '#b97a20', 0.25]}
      />

      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={3}
        maxDistance={25}
        target={[0, 1, 0]}
      />

      {/* Scene content */}
      <Room />
    </Canvas>
  )
}
