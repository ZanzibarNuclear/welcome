<script setup lang="ts">
// Fetch all simulators
const { data: simulators } = await useAsyncData('simulators', () => {
  return queryCollection('content').where('type', 'simulator').all()
})

// Fetch the index page content
const { data: indexPage } = await useAsyncData('simulators-index', () => {
  return queryCollection('content').path('/simulators').first()
})

// Group by difficulty
const simulatorsByDifficulty = computed(() => {
  if (!simulators.value) return { beginner: [], intermediate: [], advanced: [] }
  return simulators.value.reduce((acc: any, sim: any) => {
    const difficulty = sim.difficulty || 'intermediate'
    if (!acc[difficulty]) acc[difficulty] = []
    acc[difficulty].push(sim)
    return acc
  }, { beginner: [], intermediate: [], advanced: [] })
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-12">
      <ContentRenderer v-if="indexPage" :value="indexPage" class="prose prose-lg" />
    </div>

    <!-- Simulators by Difficulty -->
    <div class="space-y-12">
      <!-- Beginner -->
      <section v-if="simulatorsByDifficulty.beginner.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Beginner Friendly</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article v-for="sim in simulatorsByDifficulty.beginner" :key="sim._path"
            class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg">
            <NuxtLink :to="sim._path" class="block p-6">
              <div class="flex items-start justify-between mb-3">
                <span
                  class="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  {{ sim.difficulty }}
                </span>
                <UIcon v-if="sim.featured" name="i-heroicons-star-solid" class="text-yellow-500" />
              </div>

              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {{ sim.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {{ sim.description }}
              </p>

              <div v-if="sim.tags" class="flex flex-wrap gap-2">
                <span v-for="tag in sim.tags" :key="tag"
                  class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {{ tag }}
                </span>
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>

      <!-- Intermediate -->
      <section v-if="simulatorsByDifficulty.intermediate.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Intermediate</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article v-for="sim in simulatorsByDifficulty.intermediate" :key="sim._path"
            class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg">
            <NuxtLink :to="sim._path" class="block p-6">
              <div class="flex items-start justify-between mb-3">
                <span
                  class="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {{ sim.difficulty }}
                </span>
                <UIcon v-if="sim.featured" name="i-heroicons-star-solid" class="text-yellow-500" />
              </div>

              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {{ sim.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {{ sim.description }}
              </p>

              <div v-if="sim.tags" class="flex flex-wrap gap-2">
                <span v-for="tag in sim.tags" :key="tag"
                  class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {{ tag }}
                </span>
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>

      <!-- Advanced -->
      <section v-if="simulatorsByDifficulty.advanced.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Advanced</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article v-for="sim in simulatorsByDifficulty.advanced" :key="sim._path"
            class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg">
            <NuxtLink :to="sim._path" class="block p-6">
              <div class="flex items-start justify-between mb-3">
                <span
                  class="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                  {{ sim.difficulty }}
                </span>
                <UIcon v-if="sim.featured" name="i-heroicons-star-solid" class="text-yellow-500" />
              </div>

              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {{ sim.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {{ sim.description }}
              </p>

              <div v-if="sim.tags" class="flex flex-wrap gap-2">
                <span v-for="tag in sim.tags" :key="tag"
                  class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {{ tag }}
                </span>
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>
    </div>

    <!-- Empty State -->
    <div v-if="!simulators || simulators.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">No simulators yet. Check back soon!</p>
    </div>
  </div>
</template>
