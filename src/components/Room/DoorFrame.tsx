interface DoorFrameProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export default function DoorFrame({
  position = [0, 0, -3.95],
  rotation = [0, 0, 0],
}: DoorFrameProps) {
  const frameColor = '#6b5b4f'
  const postWidth = 0.15
  const postDepth = 0.15
  const doorWidth = 1.2
  const doorHeight = 2.4

  return (
    <group position={position} rotation={rotation}>
      {/* Left post */}
      <mesh position={[-doorWidth / 2, doorHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[postWidth, doorHeight, postDepth]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Right post */}
      <mesh position={[doorWidth / 2, doorHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[postWidth, doorHeight, postDepth]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Top beam */}
      <mesh position={[0, doorHeight + postWidth / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[doorWidth + postWidth * 2, postWidth, postDepth]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
    </group>
  )
}
