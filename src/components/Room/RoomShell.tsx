interface RoomShellProps {
  hasDoor?: boolean
  showCeiling?: boolean
}

export default function RoomShell({ hasDoor = true, showCeiling = true }: RoomShellProps) {
  const floorWidth = 12
  const floorDepth = 8
  const wallHeight = 3
  const wallThickness = 0.12

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[floorWidth, floorDepth]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, wallHeight / 2, -floorDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[floorWidth, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#f0f5f8" />
      </mesh>

      {/* Front wall: hasDoor=true 时分段+门上横梁，hasDoor=false 时整面墙 */}
      {hasDoor ? (
        <>
          <mesh position={[-(floorWidth / 2 - (floorWidth / 2 - 0.75) / 2), wallHeight / 2, floorDepth / 2]} castShadow receiveShadow>
            <boxGeometry args={[floorWidth / 2 - 0.75, wallHeight, wallThickness]} />
            <meshStandardMaterial color="#f0f5f8" />
          </mesh>
          <mesh position={[floorWidth / 2 - (floorWidth / 2 - 0.75) / 2, wallHeight / 2, floorDepth / 2]} castShadow receiveShadow>
            <boxGeometry args={[floorWidth / 2 - 0.75, wallHeight, wallThickness]} />
            <meshStandardMaterial color="#f0f5f8" />
          </mesh>
          <mesh position={[0, wallHeight - 0.2, floorDepth / 2]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.4, wallThickness]} />
            <meshStandardMaterial color="#f0f5f8" />
          </mesh>
        </>
      ) : (
        <mesh position={[0, wallHeight / 2, floorDepth / 2]} castShadow receiveShadow>
          <boxGeometry args={[floorWidth, wallHeight, wallThickness]} />
          <meshStandardMaterial color="#f0f5f8" />
        </mesh>
      )}

      {/* Left/Right walls */}
      <mesh position={[-floorWidth / 2, wallHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[floorDepth, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#f0f5f8" />
      </mesh>
      <mesh position={[floorWidth / 2, wallHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[floorDepth, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#f0f5f8" />
      </mesh>

      {/* Ceiling */}
      {showCeiling && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, wallHeight + 0.001, 0]}>
          <planeGeometry args={[floorWidth, floorDepth]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.08} />
        </mesh>
      )}
    </group>
  )
}
