<script setup lang="ts">
// Fetch the index page content
const { data: indexPage } = await useAsyncData('simulators-index', () => {
  return queryCollection('content').path('/simulators').first()
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
        to="/simulators/build-an-atom"
        class="group flex min-h-72 flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-500">
        <div>
          <div class="mb-5 flex items-center justify-between">
            <span
              class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
              Beginner
            </span>
            <UIcon name="i-heroicons-cube-transparent" class="text-3xl text-primary-500" />
          </div>
          <h2
            class="mb-3 text-2xl font-bold text-gray-900 transition group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
            Build an Atom
          </h2>
          <p class="leading-relaxed text-gray-600 dark:text-gray-400">
            Add protons, neutrons, and electrons to see how atoms become elements, isotopes, and ions.
          </p>
        </div>
        <span class="mt-8 font-semibold text-primary-600 dark:text-primary-400">
          Open simulator
        </span>
      </NuxtLink>

      <NuxtLink
        to="/simulators/isotope-explorer"
        class="group flex min-h-72 flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-500">
        <div>
          <div class="mb-5 flex items-center justify-between">
            <span
              class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Guide
            </span>
            <UIcon name="i-heroicons-arrow-top-right-on-square" class="text-3xl text-primary-500" />
          </div>
          <h2
            class="mb-3 text-2xl font-bold text-gray-900 transition group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
            Isotope Explorer
          </h2>
          <p class="leading-relaxed text-gray-600 dark:text-gray-400">
            Learn how to compare isotopes, stability, and decay patterns before launching the full explorer.
          </p>
        </div>
        <span class="mt-8 font-semibold text-primary-600 dark:text-primary-400">
          View guide
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
