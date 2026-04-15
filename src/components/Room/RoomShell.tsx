export default function RoomShell() {
  const floorWidth = 12
  const floorDepth = 8
  const wallHeight = 3
  const wallThickness = 0.12
  const wallColor = '#f0f5f8'
  const floorColor = '#e0e0e0'

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[floorWidth, floorDepth]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {/* Grid */}
      <gridHelper args={[Math.max(floorWidth, floorDepth), 20, '#cccccc', '#d8d8d8']} position={[0, 0.005, 0]} />

      {/* Back wall */}
      <mesh position={[0, wallHeight / 2, -floorDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[floorWidth, wallHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Front wall left section */}
      <mesh position={[-(floorWidth / 2 - (floorWidth / 2 - 0.75) / 2), wallHeight / 2, floorDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[floorWidth / 2 - 0.75, wallHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      {/* Front wall right section */}
      <mesh position={[floorWidth / 2 - (floorWidth / 2 - 0.75) / 2, wallHeight / 2, floorDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[floorWidth / 2 - 0.75, wallHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      {/* Above door */}
      <mesh position={[0, wallHeight - 0.2, floorDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.4, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-floorWidth / 2, wallHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[floorDepth, wallHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Right wall */}
      <mesh position={[floorWidth / 2, wallHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[floorDepth, wallHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, wallHeight, 0]}>
        <planeGeometry args={[floorWidth, floorDepth]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.08} />
      </mesh>
    </group>
  )
}
