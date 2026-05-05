<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'

type OrbitalPreset = {
  id: string
  label: string
  n: number
  l: number
  expression: string
  psi: (x: number, y: number, z: number) => number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const threeHostRef = ref<HTMLDivElement | null>(null)
const viewMode = ref<'3d' | '2d'>('3d')
const resolution = ref(260)
const range = ref(10)
const sampleCount = ref(28000)
const showPhase = ref(true)
const selectedPresetId = ref('2p_x')

const presets: OrbitalPreset[] = [
  {
    id: '1s',
    label: '1s',
    n: 1,
    l: 0,
    expression: 'psi = (1/sqrt(pi)) * e^{-r}',
    psi: (x, y, z) => {
      const r = Math.hypot(x, y, z)
      return Math.exp(-r) / Math.sqrt(Math.PI)
    }
  },
  {
    id: '2s',
    label: '2s',
    n: 2,
    l: 0,
    expression: 'psi = (1/(4*sqrt(2*pi))) * (2-r) * e^{-r/2}',
    psi: (x, y, z) => {
      const r = Math.hypot(x, y, z)
      return ((2 - r) * Math.exp(-r / 2)) / (4 * Math.sqrt(2 * Math.PI))
    }
  },
  {
    id: '2p_x',
    label: '2p_x',
    n: 2,
    l: 1,
    expression: 'psi = (1/(4*sqrt(2*pi))) * x * e^{-r/2}',
    psi: (x, y, z) => {
      const r = Math.hypot(x, y, z)
      return (x * Math.exp(-r / 2)) / (4 * Math.sqrt(2 * Math.PI))
    }
  },
  {
    id: '2p_y',
    label: '2p_y',
    n: 2,
    l: 1,
    expression: 'psi = (1/(4*sqrt(2*pi))) * y * e^{-r/2}',
    psi: (x, y, z) => {
      const r = Math.hypot(x, y, z)
      return (y * Math.exp(-r / 2)) / (4 * Math.sqrt(2 * Math.PI))
    }
  },
  {
    id: '3d_xy',
    label: '3d_xy',
    n: 3,
    l: 2,
    expression: 'psi ~ (x*y) * e^{-r/3}',
    psi: (x, y, z) => {
      const r = Math.hypot(x, y, z)
      return (x * y * Math.exp(-r / 3)) / 160
    }
  },
  {
    id: '3d_x2_y2',
    label: '3d_x2-y2',
    n: 3,
    l: 2,
    expression: 'psi ~ (x^2-y^2) * e^{-r/3}',
    psi: (x, y, z) => {
      const r = Math.hypot(x, y, z)
      return ((x * x - y * y) * Math.exp(-r / 3)) / 180
    }
  }
]

const selectedPreset = computed(() => {
  return presets.find(preset => preset.id === selectedPresetId.value) ?? presets[0]!
})

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let points: THREE.Points | null = null
let frameId = 0
let isDragging = false
let pointerId: number | null = null
let lastX = 0
let lastY = 0
let orbitTheta = Math.PI * 0.62
let orbitPhi = Math.PI * 0.48
let cameraRadius = 19

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function updateCameraPosition() {
  if (!camera) return
  const sinPhi = Math.sin(orbitPhi)
  camera.position.set(
    cameraRadius * sinPhi * Math.cos(orbitTheta),
    cameraRadius * Math.cos(orbitPhi),
    cameraRadius * sinPhi * Math.sin(orbitTheta)
  )
  camera.lookAt(0, 0, 0)
}

function initializeThree() {
  const host = threeHostRef.value
  if (!host || renderer) return

  const width = Math.max(host.clientWidth, 320)
  const height = 460

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)
  renderer.setClearColor(0x030712, 1)
  host.innerHTML = ''
  host.appendChild(renderer.domElement)

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 150)
  updateCameraPosition()

  const ambient = new THREE.AmbientLight(0xffffff, 0.75)
  scene.add(ambient)
  const key = new THREE.DirectionalLight(0xb7d8ff, 0.6)
  key.position.set(7, 5, 10)
  scene.add(key)

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xffc24d, transparent: true, opacity: 0.9 })
  )
  scene.add(nucleus)

  const axes = new THREE.AxesHelper(4)
  const axisMaterial = axes.material as THREE.Material
  axisMaterial.transparent = true
  axisMaterial.opacity = 0.25
  scene.add(axes)

  const onPointerDown = (event: PointerEvent) => {
    if (!renderer) return
    isDragging = true
    pointerId = event.pointerId
    lastX = event.clientX
    lastY = event.clientY
    renderer.domElement.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: PointerEvent) => {
    if (!isDragging || pointerId !== event.pointerId) return
    const dx = event.clientX - lastX
    const dy = event.clientY - lastY
    lastX = event.clientX
    lastY = event.clientY
    orbitTheta -= dx * 0.01
    orbitPhi = clamp(orbitPhi + dy * 0.01, 0.15, Math.PI - 0.15)
    updateCameraPosition()
  }
  const onPointerUp = (event: PointerEvent) => {
    if (!renderer || pointerId !== event.pointerId) return
    isDragging = false
    pointerId = null
    renderer.domElement.releasePointerCapture(event.pointerId)
  }
  const onWheel = (event: WheelEvent) => {
    event.preventDefault()
    cameraRadius = clamp(cameraRadius + event.deltaY * 0.01, 7, 45)
    updateCameraPosition()
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown)
  renderer.domElement.addEventListener('pointermove', onPointerMove)
  renderer.domElement.addEventListener('pointerup', onPointerUp)
  renderer.domElement.addEventListener('pointercancel', onPointerUp)
  renderer.domElement.addEventListener('wheel', onWheel, { passive: false })

  renderer.domElement.dataset.bound = 'true'

  const animate = () => {
    if (!renderer || !scene || !camera) return
    renderer.render(scene, camera)
    frameId = window.requestAnimationFrame(animate)
  }
  animate()
}

function clearOrbitalPoints() {
  if (!scene || !points) return
  scene.remove(points)
  points.geometry.dispose()
  ;(points.material as THREE.Material).dispose()
  points = null
}

function drawOrbital3d() {
  if (viewMode.value !== '3d') return
  initializeThree()
  if (!scene) return
  clearOrbitalPoints()

  const preset = selectedPreset.value
  const span = range.value
  const count = sampleCount.value
  const positions: number[] = []
  const colors: number[] = []
  let maxAbs = 0
  const candidates: Array<{ x: number, y: number, z: number, psi: number, abs: number }> = []

  for (let i = 0; i < count; i++) {
    const x = (Math.random() * 2 - 1) * span
    const y = (Math.random() * 2 - 1) * span
    const z = (Math.random() * 2 - 1) * span
    const psi = preset.psi(x, y, z)
    const abs = Math.abs(psi)
    if (abs < 1e-8) continue
    maxAbs = Math.max(maxAbs, abs)
    candidates.push({ x, y, z, psi, abs })
  }

  const denom = maxAbs || 1
  const threshold = 0.22

  for (const sample of candidates) {
    const normalized = sample.abs / denom
    if (normalized < threshold) continue
    positions.push(sample.x, sample.y, sample.z)
    const density = clamp(normalized ** 1.3, 0, 1)
    if (showPhase.value) {
      if (sample.psi >= 0) {
        colors.push(0.18 + 0.25 * density, 0.48 + 0.35 * density, 0.88)
      } else {
        colors.push(0.96, 0.48 + 0.25 * density, 0.16 + 0.2 * density)
      }
    } else {
      const mono = 0.2 + density * 0.75
      colors.push(mono, mono, mono)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.12,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.AdditiveBlending
  })

  points = new THREE.Points(geometry, material)
  scene.add(points)
}

function drawOrbital() {
  if (viewMode.value !== '2d') return
  const canvas = canvasRef.value
  if (!canvas) return

  const size = resolution.value
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const image = ctx.createImageData(size, size)
  const data = image.data
  const psiGrid = new Float32Array(size * size)

  const half = size / 2
  const span = range.value
  const preset = selectedPreset.value

  let maxAbs = 0
  for (let py = 0; py < size; py++) {
    const y = ((half - py) / half) * span
    for (let px = 0; px < size; px++) {
      const x = ((px - half) / half) * span
      const psi = preset.psi(x, y, 0)
      const idx = py * size + px
      psiGrid[idx] = psi
      const abs = Math.abs(psi)
      if (abs > maxAbs) maxAbs = abs
    }
  }

  const denom = maxAbs || 1

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const idx = py * size + px
      const psi = psiGrid[idx]! / denom
      const density = Math.min(1, Math.abs(psi) ** 2 * 3.4)
      const offset = idx * 4

      let r = 18
      let g = 26
      let b = 42

      if (showPhase.value) {
        if (psi >= 0) {
          r += Math.round(40 * density)
          g += Math.round(90 * density)
          b += Math.round(220 * density)
        } else {
          r += Math.round(235 * density)
          g += Math.round(120 * density)
          b += Math.round(30 * density)
        }
      } else {
        const mono = Math.round(250 * density)
        r = mono
        g = mono
        b = mono
      }

      data[offset] = r
      data[offset + 1] = g
      data[offset + 2] = b
      data[offset + 3] = 255
    }
  }

  ctx.putImageData(image, 0, 0)

  const axis = Math.floor(size / 2) + 0.5
  ctx.strokeStyle = 'rgba(180, 190, 220, 0.35)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(axis, 0)
  ctx.lineTo(axis, size)
  ctx.moveTo(0, axis)
  ctx.lineTo(size, axis)
  ctx.stroke()

  const tickStep = 2
  const pixelsPerUnit = size / (2 * span)
  ctx.fillStyle = 'rgba(220, 225, 240, 0.8)'
  ctx.font = '11px system-ui'
  for (let unit = -span; unit <= span; unit += tickStep) {
    if (unit === 0) continue
    const x = axis + unit * pixelsPerUnit
    const y = axis - unit * pixelsPerUnit
    ctx.fillRect(x, axis - 3, 1, 6)
    ctx.fillRect(axis - 3, y, 6, 1)
  }
}

onMounted(drawOrbital)
onMounted(() => {
  if (viewMode.value === '3d') drawOrbital3d()
  else drawOrbital()
})

watch([selectedPresetId, resolution, range, showPhase, viewMode], () => {
  if (viewMode.value === '3d') drawOrbital3d()
  else drawOrbital()
})

watch(sampleCount, () => {
  if (viewMode.value === '3d') drawOrbital3d()
})

onBeforeUnmount(() => {
  if (frameId) window.cancelAnimationFrame(frameId)
  clearOrbitalPoints()
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
    renderer = null
  }
  scene = null
  camera = null
})
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-4 md:grid-cols-2">
      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Orbital preset</span>
        <select
          v-model="selectedPresetId"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
          <option
            v-for="preset in presets"
            :key="preset.id"
            :value="preset.id">
            {{ preset.label }}
          </option>
        </select>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">View range (Bohr radii)</span>
        <input
          v-model.number="range"
          type="range"
          min="6"
          max="16"
          step="1"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">+-{{ range }} a0</div>
      </label>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">View mode</span>
        <select
          v-model="viewMode"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
          <option value="3d">3D point cloud</option>
          <option value="2d">2D cross-section (z = 0)</option>
        </select>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Resolution</span>
        <input
          v-model.number="resolution"
          type="range"
          min="180"
          max="420"
          step="20"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ resolution }} px</div>
      </label>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">3D samples</span>
        <input
          v-model.number="sampleCount"
          type="range"
          min="12000"
          max="70000"
          step="2000"
          class="w-full">
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ sampleCount.toLocaleString() }} points tested</div>
      </label>

      <label class="flex items-center gap-2 rounded-md border border-gray-200 p-3 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
        <input
          v-model="showPhase"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-400">
        Show phase colors (blue/orange sign of psi)
      </label>
    </div>

    <div
      v-show="viewMode === '2d'"
      class="flex justify-center rounded-xl border border-gray-200 bg-gray-950/95 p-4 dark:border-gray-800">
      <canvas
        ref="canvasRef"
        class="h-auto w-full max-w-[460px] rounded-md border border-gray-700 bg-gray-950 shadow-lg" />
    </div>

    <div
      v-show="viewMode === '3d'"
      class="rounded-xl border border-gray-200 bg-gray-950/95 p-4 dark:border-gray-800">
      <div
        ref="threeHostRef"
        class="mx-auto h-[460px] w-full max-w-[680px] overflow-hidden rounded-md border border-gray-700 bg-gray-950 shadow-lg" />
      <p class="mt-2 text-xs text-gray-400">
        Drag to orbit. Scroll to zoom. The shape is drawn from sampled |psi| with a threshold to highlight lobes.
      </p>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white p-4 text-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="font-semibold text-gray-900 dark:text-gray-100">
        {{ selectedPreset.label }} (n={{ selectedPreset.n }}, l={{ selectedPreset.l }})
      </div>
      <p class="mt-1 text-gray-600 dark:text-gray-400">
        {{ selectedPreset.expression }}
      </p>
      <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Hydrogenic model in atomic units for orbital intuition. 3D mode is a sampled visualization, not a full many-electron calculation.
      </p>
    </div>
  </div>
</template>
