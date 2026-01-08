<script setup lang="ts">
const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
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
        <UButton :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'" color="neutral"
          variant="ghost" @click="toggleColorMode"
          :aria-label="`Switch to ${colorMode.value === 'dark' ? 'light' : 'dark'} mode`" />
        <!-- Account Icon -->
        <UButton icon="i-heroicons-user-circle" color="primary" variant="ghost" aria-label="Account" />
      </div>
    </div>
  </header>
</template>
