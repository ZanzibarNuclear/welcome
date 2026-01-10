<script setup lang="ts">
const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
      <!-- Logo -->
      <div class="flex items-center">
        <NuxtLink to="/"
          class="text-xl font-bold bg-linear-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          Atomic Ambitions
        </NuxtLink>
      </div>

      <!-- Top-level Navigation -->
      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink to="/"
          class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          Home
        </NuxtLink>
        <NuxtLink to="/blog"
          class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          Blog
        </NuxtLink>
        <NuxtLink to="/lessons"
          class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          Lessons
        </NuxtLink>
        <NuxtLink to="/simulators"
          class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          Simulators
        </NuxtLink>
        <NuxtLink to="/about"
          class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          About
        </NuxtLink>
      </nav>

      <!-- Right side actions -->
      <div class="flex items-center gap-2">
        <!-- Color Mode Toggle -->
        <UButton :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'" color="neutral"
          variant="ghost" @click="toggleColorMode"
          :aria-label="`Switch to ${colorMode.value === 'dark' ? 'light' : 'dark'} mode`" />
        <!-- Account Icon -->
        <UButton icon="i-heroicons-user-circle" color="primary" variant="ghost" aria-label="Account" />
      </div>
    </div>
  </header>
</template>
