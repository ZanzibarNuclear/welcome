<script setup lang="ts">
const { data: isotopes } = await useAsyncData('isotopes', async () => {
  const items = await queryCollection('content').path('/isotopes').all()
  return items
    .filter((item: any) => item.type === 'isotope')
    .sort((a: any, b: any) => (a.atomicNumber ?? 999) - (b.atomicNumber ?? 999) || a.massNumber - b.massNumber)
})

const { data: indexPage } = await useAsyncData('isotopes-index', () => {
  return queryCollection('content').path('/isotopes/index').first()
})

const byElement = computed(() => {
  if (!isotopes.value) return {}
  return isotopes.value.reduce((acc: any, iso: any) => {
    const el = iso.element || 'Unknown'
    if (!acc[el]) acc[el] = []
    acc[el].push(iso)
    return acc
  }, {})
})
</script>

<template>
  <div>
    <div class="mb-12">
      <ContentRenderer v-if="indexPage" :value="indexPage" class="prose prose-lg" />
    </div>

    <div class="space-y-12">
      <section v-for="(isos, element) in byElement" :key="element">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ element }}</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="iso in isos"
            :key="(iso as any).path"
            class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg">
            <NuxtLink :to="(iso as any).path" class="block p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center justify-center w-14 h-14 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
                  <span class="text-xs text-primary-500 dark:text-primary-400 font-medium leading-none">{{ iso.massNumber }}</span>
                  <span class="text-xl font-bold text-primary-700 dark:text-primary-300 leading-none ml-0.5">{{ iso.symbol }}</span>
                </div>
                <span :class="[
                  'text-xs px-2 py-1 rounded-full font-medium',
                  iso.stability === 'stable'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                ]">
                  {{ iso.stability }}
                </span>
              </div>

              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">{{ iso.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">{{ iso.description }}</p>

              <div v-if="iso.halfLife" class="text-xs text-gray-500 dark:text-gray-500">
                Half-life: <span class="font-medium text-gray-700 dark:text-gray-300">{{ iso.halfLife }}</span>
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>
    </div>

    <div v-if="!isotopes || isotopes.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">No isotopes yet. Check back soon!</p>
    </div>
  </div>
</template>
