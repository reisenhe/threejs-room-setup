import RoomShell from './RoomShell'
import ReceptionDesk from './ReceptionDesk'
import WaitingChairs from './WaitingChairs'
import DoorFrame from './DoorFrame'

interface RoomProps {
  hasDoor?: boolean
  showCeiling?: boolean
}

export default function Room({ hasDoor = true, showCeiling = true }: RoomProps) {
  return (
    <group>
      <RoomShell hasDoor={hasDoor} showCeiling={showCeiling} />
      <ReceptionDesk />
      <WaitingChairs rows={3} seatsPerRow={4} position={[1.5, 0, 0.5]} />
      {hasDoor && <DoorFrame position={[0, 0, 3.94]} />}
    </group>
  )
}
