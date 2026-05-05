<script setup lang="ts">
import type { Component } from 'vue'

const route = useRoute()
const slug = route.params.slug as string

// Fetch the simulator
const { data: simulator } = await useAsyncData(`simulator-${slug}`, () => {
  return queryCollection('content').path(`/simulators/${slug}`).first()
})

// 404 if not found
if (!simulator.value) {
  throw createError({ statusCode: 404, message: 'Simulator not found' })
}

// Meta tags
useHead({
  title: simulator.value.title,
  meta: [
    { name: 'description', content: simulator.value.description }
  ]
})

// Import the simulator component dynamically if specified
const simulatorComponentName = simulator.value.component
const simulatorComponentLoaders = import.meta.glob<{ default: Component }>('../../components/simulators/*.vue')
const simulatorComponentPath = simulatorComponentName
  ? `../../components/simulators/${simulatorComponentName}.vue`
  : null
const simulatorLoader = simulatorComponentPath
  ? simulatorComponentLoaders[simulatorComponentPath]
  : null
const SimulatorComponent = simulatorLoader
  ? defineAsyncComponent(() => simulatorLoader().then((module) => module.default))
  : null

const externalUrl = simulator.value.externalUrl
const externalLabel = simulator.value.externalLabel ?? `Open ${simulator.value.title}`
</script>

<template>
  <div v-if="simulator">
    <!-- Simulator Header -->
    <header class="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <span
:class="[
          'text-sm px-3 py-1 rounded-full font-medium',
          simulator.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
            simulator.difficulty === 'intermediate' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
              'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
        ]">
          {{ simulator.difficulty }}
        </span>
        <span v-if="simulator.featured" class="text-sm text-yellow-600 dark:text-yellow-400">
          <UIcon name="i-heroicons-star-solid" class="inline" />
          Featured
        </span>
      </div>

      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
        {{ simulator.title }}
      </h1>

      <p class="text-xl text-gray-600 dark:text-gray-400">
        {{ simulator.description }}
      </p>

      <div v-if="simulator.tags" class="flex flex-wrap gap-2 mt-4">
        <span
v-for="tag in simulator.tags" :key="tag"
          class="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          {{ tag }}
        </span>
      </div>
    </header>

    <!-- Embedded Simulator Component -->
    <div
v-if="SimulatorComponent"
      class="mb-12 p-8 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
      <component :is="SimulatorComponent" />
    </div>

    <!-- External Simulator Link -->
    <div
v-if="externalUrl"
      class="mb-12 rounded-2xl border border-primary-200 bg-primary-50 p-8 dark:border-primary-900/60 dark:bg-primary-950/30">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
            External Interactive Tool
          </p>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Open {{ simulator.title }}
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            Learn about isotopes and how they change.
          </p>
        </div>
        <UButton
:to="externalUrl" target="_blank" rel="noopener noreferrer"
          trailing-icon="i-heroicons-arrow-top-right-on-square" size="xl">
          {{ externalLabel }}
        </UButton>
      </div>
    </div>

    <!-- Simulator Content/Instructions -->
    <div class="mb-8">
      <ContentRenderer :value="simulator" class="prose prose-lg" />
    </div>

    <!-- Simulator Footer -->
    <footer class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div class="flex justify-between items-center">
        <UButton to="/simulators" variant="ghost" leading-icon="i-heroicons-arrow-left">
          Back to Simulators
        </UButton>
        <div class="flex gap-2">
          <UButton variant="ghost" icon="i-heroicons-share" aria-label="Share simulator" />
        </div>
      </div>
    </footer>
  </div>
</template>
