<script setup lang="ts">
import { ref } from 'vue'
import { getElectronShells } from './atomShellData'

const protons = ref(0)
const neutrons = ref(0)
const electrons = ref(0)

const elements = [
  'None', 'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon',
  'Nitrogen', 'Oxygen', 'Fluorine', 'Neon', 'Sodium', 'Magnesium', 'Aluminum',
  'Silicon', 'Phosphorus', 'Sulfur', 'Chlorine', 'Argon', 'Potassium', 'Calcium',
  'Scandium', 'Titanium', 'Vanadium', 'Chromium', 'Manganese', 'Iron', 'Cobalt',
  'Nickel', 'Copper', 'Zinc', 'Gallium', 'Germanium', 'Arsenic', 'Selenium',
  'Bromine', 'Krypton', 'Rubidium', 'Strontium', 'Yttrium', 'Zirconium', 'Niobium',
  'Molybdenum', 'Technetium', 'Ruthenium', 'Rhodium', 'Palladium', 'Silver',
  'Cadmium', 'Indium', 'Tin', 'Antimony', 'Tellurium', 'Iodine', 'Xenon',
  'Cesium', 'Barium', 'Lanthanum', 'Cerium', 'Praseodymium', 'Neodymium',
  'Promethium', 'Samarium', 'Europium', 'Gadolinium', 'Terbium', 'Dysprosium',
  'Holmium', 'Erbium', 'Thulium', 'Ytterbium', 'Lutetium', 'Hafnium', 'Tantalum',
  'Tungsten', 'Rhenium', 'Osmium', 'Iridium', 'Platinum', 'Gold', 'Mercury',
  'Thallium', 'Lead', 'Bismuth', 'Polonium', 'Astatine', 'Radon', 'Francium',
  'Radium', 'Actinium', 'Thorium', 'Protactinium', 'Uranium', 'Neptunium',
  'Plutonium', 'Americium', 'Curium', 'Berkelium', 'Californium', 'Einsteinium',
  'Fermium', 'Mendelevium', 'Nobelium', 'Lawrencium', 'Rutherfordium', 'Dubnium',
  'Seaborgium', 'Bohrium', 'Hassium', 'Meitnerium', 'Darmstadtium', 'Roentgenium',
  'Copernicium', 'Nihonium', 'Flerovium', 'Moscovium', 'Livermorium', 'Tennessine',
  'Oganesson'
]

const currentElement = computed(() => {
  return protons.value < elements.length ? elements[protons.value] : `Element ${protons.value}`
})

const charge = computed(() => {
  return protons.value - electrons.value
})

const massNumber = computed(() => {
  return protons.value + neutrons.value
})

const electronShells = computed(() => getElectronShells(protons.value, electrons.value))

const SHELL_INNER = 180
const SHELL_OUTER = 460
const NUCLEUS_RADIUS = 34
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

type Nucleon = {
  id: number
  type: 'proton' | 'neutron'
  x: number
  y: number
  z: number
  size: number
  opacity: number
}

const isProtonAtIndex = (index: number, total: number, protonCount: number) => {
  if (total === 0) return false
  return ((index * 37) % total) < protonCount
}

const nucleons = computed<Nucleon[]>(() => {
  const total = protons.value + neutrons.value
  if (total === 0) return []

  const particles = Array.from({ length: total }, (_, i) => {
    const t = (i + 0.5) / total
    const theta = i * GOLDEN_ANGLE
    const phi = Math.acos(1 - 2 * t)
    const radiusFactor = 0.38 + 0.62 * (((i * 53) % 101) / 100)

    const x = radiusFactor * Math.sin(phi) * Math.cos(theta)
    const y = radiusFactor * Math.sin(phi) * Math.sin(theta)
    const z = radiusFactor * Math.cos(phi)

    const nucleonType: Nucleon['type'] = isProtonAtIndex(i, total, protons.value) ? 'proton' : 'neutron'

    return {
      id: i,
      type: nucleonType,
      x: x * NUCLEUS_RADIUS,
      y: y * NUCLEUS_RADIUS,
      z,
      size: 8 + (z + 1) * 4,
      opacity: 0.58 + (z + 1) * 0.18
    }
  })

  return particles.sort((a, b) => a.z - b.z)
})

const shellDiameter = (idx: number) => {
  const n = electronShells.value.length
  if (n <= 1) return SHELL_INNER
  return SHELL_INNER + ((SHELL_OUTER - SHELL_INNER) * idx) / (n - 1)
}

const addProton = () => { protons.value++ }
const removeProton = () => { if (protons.value > 0) protons.value-- }
const addNeutron = () => { neutrons.value++ }
const removeNeutron = () => { if (neutrons.value > 0) neutrons.value-- }
const addElectron = () => { electrons.value++ }
const removeElectron = () => { if (electrons.value > 0) electrons.value-- }
const reset = () => {
  protons.value = 0
  neutrons.value = 0
  electrons.value = 0
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ currentElement }}</h3>
      <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <div>Atomic Number: {{ protons }}</div>
        <div>Mass Number: {{ massNumber }}</div>
        <div>Charge: {{ charge > 0 ? '+' : '' }}{{ charge }}</div>
      </div>
    </div>

    <!-- Visual Representation -->
    <div
      class="flex justify-center items-center min-h-[480px] bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 overflow-hidden">
      <div class="relative flex items-center justify-center" style="width: 460px; height: 460px;">
        <!-- Electron shells -->
        <div
          v-for="(count, shellIdx) in electronShells" :key="shellIdx"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary-300 dark:border-primary-600 animate-spin-slow"
          :style="{
            width: `${shellDiameter(shellIdx)}px`,
            height: `${shellDiameter(shellIdx)}px`,
            animationDuration: `${20 + shellIdx * 8}s`,
            animationDirection: shellIdx % 2 === 0 ? 'normal' : 'reverse'
          }">
          <div
            v-for="i in count" :key="i"
            class="absolute w-3 h-3 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"
            :style="{
              top: `${50 - 50 * Math.cos((i - 1) * 2 * Math.PI / count)}%`,
              left: `${50 + 50 * Math.sin((i - 1) * 2 * Math.PI / count)}%`
            }"/>
        </div>

        <!-- Nucleus -->
        <div class="relative w-36 h-36 flex items-center justify-center z-10">
          <div class="absolute inset-0 rounded-full bg-linear-to-br from-primary-200/60 to-primary-500/50 dark:from-primary-900/40 dark:to-primary-700/45 blur-[1px]" />
          <div
            v-for="nucleon in nucleons"
            :key="nucleon.id"
            class="absolute rounded-full border shadow-sm"
            :class="nucleon.type === 'proton'
              ? 'border-red-300/70 bg-radial-[at_30%_30%] from-red-300 to-red-600 dark:border-red-300/30 dark:from-red-300 dark:to-red-700'
              : 'border-sky-300/70 bg-radial-[at_30%_30%] from-sky-200 to-sky-600 dark:border-sky-300/30 dark:from-sky-200 dark:to-sky-700'"
            :style="{
              width: `${nucleon.size}px`,
              height: `${nucleon.size}px`,
              opacity: nucleon.opacity,
              left: `calc(50% + ${nucleon.x}px)`,
              top: `calc(50% + ${nucleon.y}px)`,
              transform: 'translate(-50%, -50%)'
            }" />
          <div class="absolute -bottom-7 text-center">
            <div class="rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">
              Nucleus: {{ protons + neutrons }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="grid md:grid-cols-3 gap-4">
      <!-- Protons -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="text-center mb-3">
          <div class="text-lg font-semibold text-red-600 dark:text-red-400">Protons</div>
          <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ protons }}</div>
        </div>
        <div class="flex gap-2">
          <UButton :disabled="protons === 0" color="neutral" variant="outline" class="flex-1" @click="removeProton">-
          </UButton>
          <UButton color="primary" class="flex-1" @click="addProton">+</UButton>
        </div>
      </div>

      <!-- Neutrons -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="text-center mb-3">
          <div class="text-lg font-semibold text-gray-600 dark:text-gray-400">Neutrons</div>
          <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ neutrons }}</div>
        </div>
        <div class="flex gap-2">
          <UButton :disabled="neutrons === 0" color="neutral" variant="outline" class="flex-1" @click="removeNeutron">-
          </UButton>
          <UButton color="primary" class="flex-1" @click="addNeutron">+</UButton>
        </div>
      </div>

      <!-- Electrons -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="text-center mb-3">
          <div class="text-lg font-semibold text-blue-600 dark:text-blue-400">Electrons</div>
          <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ electrons }}</div>
        </div>
        <div class="flex gap-2">
          <UButton :disabled="electrons === 0" color="neutral" variant="outline" class="flex-1" @click="removeElectron">
            -</UButton>
          <UButton color="primary" class="flex-1" @click="addElectron">+</UButton>
        </div>
      </div>
    </div>

    <!-- Reset Button -->
    <div class="text-center">
      <UButton variant="outline" color="neutral" @click="reset">Reset</UButton>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
</style>
