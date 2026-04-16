import { useMemo } from 'react'
import { Instances, Instance } from '@react-three/drei'

export interface ChairProps {
  position?: [number, number, number]
}

export function Chair({ position = [0, 0, 0] }: ChairProps) {
  const legRadius = 0.03
  const legHeight = 0.45

  return (
    <group position={position}>
      <mesh position={[0, 0.47, 0]} castShadow>
        <boxGeometry args={[0.45, 0.05, 0.45]} />
        <meshStandardMaterial color="#4a90d9" />
      </mesh>
      <mesh position={[0, 0.8, -0.2]} castShadow>
        <boxGeometry args={[0.45, 0.6, 0.05]} />
        <meshStandardMaterial color="#4a90d9" />
      </mesh>
      {[
        [0.18, legHeight / 2, 0.18],
        [-0.18, legHeight / 2, 0.18],
        [0.18, legHeight / 2, -0.18],
        [-0.18, legHeight / 2, -0.18],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[legRadius, legRadius, legHeight, 8]} />
          <meshStandardMaterial color="#8a8a8a" />
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
  const chairPositions = useMemo(() => {
    const spacingX = 0.6
    const spacingZ = 1.0
    const positions: [number, number, number][] = []
    for (let r = 0; r < rows; r++) {
      for (let s = 0; s < seatsPerRow; s++) {
        const x = s * spacingX - ((seatsPerRow - 1) * spacingX) / 2
        const z = r * spacingZ - ((rows - 1) * spacingZ) / 2
        positions.push([!r && !s ? 2 * x : x, 0, z])
      }
    }
    return positions
  }, [rows, seatsPerRow])

  const legOffsets: [number, number, number][] = [
    [0.18, 0.225, 0.18],
    [-0.18, 0.225, 0.18],
    [0.18, 0.225, -0.18],
    [-0.18, 0.225, -0.18],
  ]

  return (
    <group position={position}>
      {/* Seats */}
      <Instances limit={chairPositions.length} castShadow>
        <boxGeometry args={[0.45, 0.05, 0.45]} />
        <meshStandardMaterial color="#4a90d9" />
        {chairPositions.map((pos, i) => (
          <Instance key={`seat-${i}`} position={[pos[0], 0.47, pos[2]]} />
        ))}
      </Instances>

      {/* Backrests */}
      <Instances limit={chairPositions.length} castShadow>
        <boxGeometry args={[0.45, 0.6, 0.05]} />
        <meshStandardMaterial color="#4a90d9" />
        {chairPositions.map((pos, i) => (
          <Instance key={`back-${i}`} position={[pos[0], 0.8, pos[2] - 0.2]} />
        ))}
      </Instances>

      {/* Legs */}
      <Instances limit={chairPositions.length * 4} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.45, 8]} />
        <meshStandardMaterial color="#8a8a8a" />
        {chairPositions.flatMap((pos, i) =>
          legOffsets.map((off, j) => (
            <Instance
              key={`leg-${i}-${j}`}
              position={[pos[0] + off[0], off[1], pos[2] + off[2]]}
            />
          ))
        )}
      </Instances>
    </group>
  )
}
