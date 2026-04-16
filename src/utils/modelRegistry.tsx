import { ComponentType } from 'react'
import RoomShell from '../components/Room/RoomShell'
import ReceptionDesk from '../components/Room/ReceptionDesk'
import { Chair } from '../components/Room/WaitingChairs'
import DoorFrame from '../components/Room/DoorFrame'
import Room from '../components/Room/Room'

export interface ModelEntry {
  id: string
  name: string
  description: string
  Component: ComponentType
  // Camera position optimized for each model's size
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
}

function CenteredReceptionDesk() {
  return (
    <group position={[4.5, 0, 2.5]}>
      <ReceptionDesk />
    </group>
  )
}

function SingleChair() {
  return <Chair />
}

function CenteredDoorFrame() {
  return <DoorFrame position={[0, 0, 0]} />
}

export const modelRegistry: ModelEntry[] = [
  {
    id: 'full-scene',
    name: '完整场景',
    description: '包含所有家具的完整诊所场景',
    Component: Room,
    cameraPosition: [10, 12, 10],
    cameraTarget: [0, 1, 0],
  },
  {
    id: 'room-shell',
    name: '房间框架',
    description: '仅包含地板、墙壁和天花板的房间结构',
    Component: RoomShell,
    cameraPosition: [10, 12, 10],
    cameraTarget: [0, 1, 0],
  },
  {
    id: 'reception-desk',
    name: '接待台',
    description: 'L型接待台，含桌面和前面板',
    Component: CenteredReceptionDesk,
    cameraPosition: [3, 3, 3],
    cameraTarget: [0, 0.5, 0],
  },
  {
    id: 'chair',
    name: '椅子',
    description: '单把候诊椅，含座椅、靠背和四条腿',
    Component: SingleChair,
    cameraPosition: [1.5, 1.5, 1.5],
    cameraTarget: [0, 0.5, 0],
  },
  {
    id: 'door-frame',
    name: '门框',
    description: '入口门框，含两个立柱和横梁',
    Component: CenteredDoorFrame,
    cameraPosition: [3, 2.5, 3],
    cameraTarget: [0, 1.2, 0],
  },
]
