<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()
const showSidebar = computed(() => {
  // Check if page has hideSidebar meta
  return !route.meta.hideSidebar
})

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="flex items-center justify-between px-4 h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900 dark:text-white">
            Logo
          </NuxtLink>
        </div>

        <!-- Top-level Navigation -->
        <nav class="flex items-center gap-4">
          <NuxtLink to="/"
            class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            Home
          </NuxtLink>
          <NuxtLink to="/about"
            class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            About
          </NuxtLink>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center gap-2">
          <!-- Color Mode Toggle -->
          <UButton :icon="colorMode.preference === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'" color="neutral"
            variant="ghost" @click="toggleColorMode"
            :aria-label="`Switch to ${colorMode.preference === 'dark' ? 'light' : 'dark'} mode`" />
          <!-- Account Icon -->
          <UButton icon="i-heroicons-user-circle" color="primary" variant="ghost" aria-label="Account" />
        </div>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar -->
      <aside v-if="showSidebar"
        class="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto">
        <nav class="p-4 space-y-2">
          <NuxtLink to="/"
            class="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
            Home
          </NuxtLink>
          <NuxtLink to="/docs"
            class="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
            Documentation
          </NuxtLink>
          <NuxtLink to="/guides"
            class="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
            Guides
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
        <div class="p-6 text-gray-900 dark:text-gray-100">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
