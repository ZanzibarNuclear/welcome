<script setup lang="ts">
// Fetch the index page content
const { data: indexPage } = await useAsyncData('simulators-index', () => {
  return queryCollection('content').path('/simulators').first()
})

const { data: simulators } = await useAsyncData('simulators-list', async () => {
  const items = await queryCollection('content')
    .where('type', '=', 'simulator')
    .all()

  return [...items].sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
})

const difficultyBadgeClass = (difficulty?: string) => {
  if (difficulty === 'beginner') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  if (difficulty === 'intermediate') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
}

const simulatorIcon = (path?: string) => {
  if (!path) return 'i-heroicons-beaker'
  if (path.includes('build-an-atom-bohr')) return 'i-heroicons-cube-transparent'
  if (path.includes('build-an-atom-quantum')) return 'i-heroicons-sparkles'
  if (path.includes('isotope-explorer')) return 'i-heroicons-arrow-top-right-on-square'
  if (path.includes('hydrogenic-orbital-viewer')) return 'i-heroicons-beaker'
  if (path.includes('pipe-flow')) return 'i-heroicons-arrows-right-left'
  if (path.includes('hydro-power')) return 'i-heroicons-bolt'
  return 'i-heroicons-beaker'
}

useHead({
  title: indexPage.value?.title
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-12">
      <ContentRenderer v-if="indexPage" :value="indexPage" class="prose prose-lg" />
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <NuxtLink
        v-for="simulator in simulators"
        :key="simulator.path"
        :to="simulator.path"
        class="group flex min-h-72 flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 no-underline shadow-sm transition hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-500">
        <div>
          <div class="mb-5 flex items-center justify-between">
            <span
              class="rounded-full px-3 py-1 text-sm font-medium"
              :class="difficultyBadgeClass(simulator.difficulty)">
              {{ simulator.difficulty ?? 'advanced' }}
            </span>
            <UIcon :name="simulatorIcon(simulator.path)" class="text-3xl text-primary-500" />
          </div>
          <h2
            class="mb-3 text-2xl font-bold text-gray-900 transition group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
            {{ simulator.title }}
          </h2>
          <p class="leading-relaxed text-gray-600 dark:text-gray-400">
            {{ simulator.description ?? 'Open this simulator.' }}
          </p>
        </div>
        <span class="mt-8 font-semibold text-primary-600 dark:text-primary-400">
          Open simulator
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
