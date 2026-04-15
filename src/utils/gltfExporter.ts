import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import type { Object3D } from 'three'

export async function exportToGLTF(scene: Object3D, filename: string = 'scene'): Promise<void> {
  const exporter = new GLTFExporter()
  const gltf = await exporter.parseAsync(scene, { binary: false })
  const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' })
  downloadBlob(blob, `${filename}.gltf`)
}

export async function exportToGLB(scene: Object3D, filename: string = 'scene'): Promise<void> {
  const exporter = new GLTFExporter()
  const glb = await exporter.parseAsync(scene, { binary: true })
  const blob = new Blob([glb as ArrayBuffer], { type: 'application/octet-stream' })
  downloadBlob(blob, `${filename}.glb`)
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
