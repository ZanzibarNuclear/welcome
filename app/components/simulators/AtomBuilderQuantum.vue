<script setup lang="ts">
import { ref } from 'vue'
import { getElectronShells } from './atomShellData'

const SHELL_CAPS = [2, 8, 18, 32, 50, 72, 98]

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

const charge = computed(() => protons.value - electrons.value)

const massNumber = computed(() => protons.value + neutrons.value)

const electronShells = computed(() => getElectronShells(protons.value, electrons.value))

const SHELL_INNER = 180
const SHELL_OUTER = 460

const shellDiameter = (idx: number) => {
  const n = electronShells.value.length
  if (n <= 1) return SHELL_OUTER
  return SHELL_INNER + ((SHELL_OUTER - SHELL_INNER) * idx) / (n - 1)
}

/** Soft “probability” tint per shell (schematic, not real orbital shapes). */
const shellCloudStyle = (shellIdx: number, count: number) => {
  const cap = SHELL_CAPS[shellIdx] ?? 32
  const density = Math.min(1, count / cap)
  const diameter = shellDiameter(shellIdx)
  const hue = 210 + shellIdx * 18
  const core = `hsla(${hue}, 85%, 58%, ${0.35 + density * 0.45})`
  const edge = `hsla(${hue}, 70%, 45%, ${0.08 + density * 0.2})`
  return {
    width: `${diameter}px`,
    height: `${diameter}px`,
    background: `
      radial-gradient(ellipse 52% 48% at 50% 50%, ${core} 0%, transparent 62%),
      radial-gradient(ellipse 45% 55% at 50% 50%, ${edge} 0%, transparent 58%),
      radial-gradient(circle at 50% 50%, ${core} 0%, transparent 72%)
    `,
    filter: `blur(${10 + shellIdx * 2}px)`,
    opacity: 0.55 + density * 0.35
  }
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

    <div
      class="flex justify-center items-center min-h-[480px] bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 overflow-hidden">
      <div class="relative flex items-center justify-center isolate" style="width: 460px; height: 460px;">
        <div
          v-for="(count, shellIdx) in electronShells"
          v-show="count > 0"
          :key="shellIdx"
          class="pointer-events-none absolute inset-0 flex items-center justify-center"
          :style="{ zIndex: electronShells.length - shellIdx }">
          <div
            class="cloud-layer shrink-0 rounded-[50%] animate-cloud-drift"
            :style="{
              ...shellCloudStyle(shellIdx, count),
              animationDelay: `${shellIdx * 0.7}s`
            }" />
        </div>

        <div
          class="relative z-30 w-32 h-32 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
          <div class="text-white text-center">
            <div class="text-xs font-semibold">Nucleus</div>
            <div class="text-2xl font-bold">{{ protons + neutrons }}</div>
          </div>
        </div>
      </div>
    </div>

    <p class="text-center text-xs text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
      Electron shells are drawn as overlapping probability clouds (schematic). Real atoms use quantum orbitals with more complex shapes; this view keeps the same shell filling rules as the Bohr-model builder.
    </p>

    <div class="grid md:grid-cols-3 gap-4">
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

    <div class="text-center">
      <UButton variant="outline" color="neutral" @click="reset">Reset</UButton>
    </div>
  </div>
</template>

<style scoped>
@keyframes cloud-drift {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.03);
  }
}

.animate-cloud-drift {
  animation: cloud-drift 14s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-cloud-drift {
    animation: none;
  }
}
</style>
