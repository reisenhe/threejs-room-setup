interface ChairProps {
  position?: [number, number, number]
}

function Chair({ position = [0, 0, 0] }: ChairProps) {
  const seatColor = '#4a90d9'
  const legColor = '#8a8a8a'
  const legRadius = 0.03
  const legHeight = 0.45

  return (
    <group position={position}>
      {/* Seat */}
      <mesh position={[0, 0.47, 0]} castShadow>
        <boxGeometry args={[0.45, 0.05, 0.45]} />
        <meshStandardMaterial color={seatColor} />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.8, -0.2]} castShadow>
        <boxGeometry args={[0.45, 0.6, 0.05]} />
        <meshStandardMaterial color={seatColor} />
      </mesh>

      {/* 4 legs */}
      {[
        [0.18, legHeight / 2, 0.18],
        [-0.18, legHeight / 2, 0.18],
        [0.18, legHeight / 2, -0.18],
        [-0.18, legHeight / 2, -0.18],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[legRadius, legRadius, legHeight, 8]} />
          <meshStandardMaterial color={legColor} />
        </mesh>
      ))}
    </group>
  )
}

interface WaitingChairsProps {
  rows?: number
  seatsPerRow?: number
  position?: [number, number, number]
}

export default function WaitingChairs({
  rows = 3,
  seatsPerRow = 4,
  position = [1, 0, 0],
}: WaitingChairsProps) {
  const spacingX = 0.6
  const spacingZ = 1.0

  const chairs: { pos: [number, number, number]; key: string }[] = []
  for (let r = 0; r < rows; r++) {
    for (let s = 0; s < seatsPerRow; s++) {
      const x = s * spacingX - ((seatsPerRow - 1) * spacingX) / 2
      const z = r * spacingZ - ((rows - 1) * spacingZ) / 2
      chairs.push({ pos: [(!r && !s ? 2 * x : x), 0, z], key: `${r}-${s}` })
    }
  }

  return (
    <group position={position}>
      {chairs.map(({ pos, key }) => (
        <Chair key={key} position={pos} />
      ))}
    </group>
  )
}
