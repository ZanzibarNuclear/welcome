<script setup lang="ts">
import { ref } from 'vue'

const protons = ref(0)
const neutrons = ref(0)
const electrons = ref(0)

const elements = [
  'None', 'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon',
  'Nitrogen', 'Oxygen', 'Fluorine', 'Neon', 'Sodium', 'Magnesium', 'Aluminum',
  'Silicon', 'Phosphorus', 'Sulfur', 'Chlorine', 'Argon', 'Potassium', 'Calcium'
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
      class="flex justify-center items-center min-h-[300px] bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8">
      <div class="relative">
        <!-- Nucleus -->
        <div
          class="w-32 h-32 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
          <div class="text-white text-center">
            <div class="text-xs font-semibold">Nucleus</div>
            <div class="text-2xl font-bold">{{ protons + neutrons }}</div>
          </div>
        </div>

        <!-- Electron shells (simplified) -->
        <div v-if="electrons > 0" class="absolute inset-0 -m-8">
          <div
            class="w-48 h-48 rounded-full border-2 border-dashed border-primary-300 dark:border-primary-600 animate-spin-slow">
            <div
v-for="i in Math.min(electrons, 8)" :key="i" class="absolute w-3 h-3 bg-blue-500 rounded-full" :style="{
              top: `${50 + 45 * Math.sin(i * Math.PI / 4)}%`,
              left: `${50 + 45 * Math.cos(i * Math.PI / 4)}%`
            }"/>
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
