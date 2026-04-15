import { useRef } from 'react'
import { Group } from 'three'

export default function ReceptionDesk() {
  const group = useRef<Group>(null)

  const woodColor = '#d4a574'
  const topColor = '#e8d5b7'

  return (
    <group ref={group} position={[-4.5, 0, -2.5]}>
      {/* Main desk body — long section */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1, 0.7]} />
        <meshStandardMaterial color={woodColor} />
      </mesh>

      {/* Desk top surface */}
      <mesh position={[0, 1.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.05, 0.8]} />
        <meshStandardMaterial color={topColor} />
      </mesh>

      {/* L-shaped side wing */}
      <mesh position={[1.05, 0.5, 0.55]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 1, 1.2]} />
        <meshStandardMaterial color={woodColor} />
      </mesh>

      {/* Side wing top */}
      <mesh position={[1.05, 1.02, 0.55]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.05, 1.3]} />
        <meshStandardMaterial color={topColor} />
      </mesh>

      {/* Front panel (customer-facing, taller) */}
      <mesh position={[0, 0.6, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.2, 0.06]} />
        <meshStandardMaterial color={woodColor} roughness={0.6} />
      </mesh>

      {/* Side panel */}
      <mesh position={[1.35, 0.6, 0.55]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 1.2, 1.2]} />
        <meshStandardMaterial color={woodColor} roughness={0.6} />
      </mesh>
    </group>
  )
}
