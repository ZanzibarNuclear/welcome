<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: isotope } = await useAsyncData(`isotope-${slug}`, () => {
  return queryCollection('content').path(`/isotopes/${slug}`).first()
})

if (!isotope.value) {
  throw createError({ statusCode: 404, message: 'Isotope not found' })
}

useHead({
  title: isotope.value.title,
  meta: [{ name: 'description', content: isotope.value.description }]
})
</script>

<template>
  <div v-if="isotope">
    <header class="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-start gap-6 mb-6">
        <!-- Element symbol tile -->
        <div class="flex-none flex flex-col items-center justify-center w-24 h-24 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
          <span class="text-sm text-primary-500 dark:text-primary-400 font-medium">{{ isotope.massNumber }}</span>
          <span class="text-4xl font-bold text-primary-700 dark:text-primary-300 leading-none">{{ isotope.symbol }}</span>
          <span class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">{{ isotope.atomicNumber }}</span>
        </div>

        <div class="flex-1">
          <div class="flex flex-wrap gap-2 mb-3">
            <span :class="[
              'text-sm px-3 py-1 rounded-full font-medium',
              isotope.stability === 'stable'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
            ]">
              {{ isotope.stability }}
            </span>
            <span v-for="tag in isotope.tags" :key="tag"
              class="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {{ tag }}
            </span>
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ isotope.title }}
          </h1>
        </div>
      </div>

      <p class="text-xl text-gray-600 dark:text-gray-400 mb-6">{{ isotope.description }}</p>

      <!-- Key facts grid -->
      <dl class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-if="isotope.neutrons" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Neutrons</dt>
          <dd class="text-2xl font-bold text-gray-900 dark:text-white">{{ isotope.neutrons }}</dd>
        </div>
        <div v-if="isotope.halfLife" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Half-life</dt>
          <dd class="text-lg font-bold text-gray-900 dark:text-white">{{ isotope.halfLife }}</dd>
        </div>
        <div v-if="isotope.decayMode" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Decay</dt>
          <dd class="text-sm font-semibold text-gray-900 dark:text-white">{{ isotope.decayMode }}</dd>
        </div>
        <div v-if="isotope.abundance" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Abundance</dt>
          <dd class="text-sm font-semibold text-gray-900 dark:text-white">{{ isotope.abundance }}</dd>
        </div>
      </dl>
    </header>

    <ContentRenderer :value="isotope" class="prose prose-lg" />

    <div v-if="isotope.applications?.length" class="mt-10 p-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Applications</h2>
      <ul class="space-y-2">
        <li v-for="app in isotope.applications" :key="app" class="flex items-start gap-2 text-gray-700 dark:text-gray-300">
          <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-none"></span>
          {{ app }}
        </li>
      </ul>
    </div>

    <footer class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <UButton to="/isotopes" variant="ghost" leading-icon="i-heroicons-arrow-left">
        All Isotopes
      </UButton>
    </footer>
  </div>
</template>
