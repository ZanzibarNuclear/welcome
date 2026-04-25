<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex flex-col items-center gap-4">
        <!-- Row 1: Links -->
        <nav class="flex flex-wrap justify-center gap-6 text-sm">
          <NuxtLink to="/about"
            class="text-gray-600 dark:text-cherenkov-400 hover:text-gray-900 dark:hover:text-cherenkov-300 transition-colors font-medium">
            About
          </NuxtLink>
          <NuxtLink to="/contact"
            class="text-gray-600 dark:text-cherenkov-400 hover:text-gray-900 dark:hover:text-cherenkov-300 transition-colors font-medium">
            Contact
          </NuxtLink>
          <NuxtLink to="/policies"
            class="text-gray-600 dark:text-cherenkov-400 hover:text-gray-900 dark:hover:text-cherenkov-300 transition-colors font-medium">
            Policies
          </NuxtLink>
        </nav>

        <!-- Row 2: Logo + Copyright -->
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="hover:opacity-80 transition-opacity">
            <img src="/images/atomic-ambitions-logo-sq.png" alt="Atomic Ambitions" class="h-8 w-8" />
          </NuxtLink>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            © {{ currentYear }} Atomic Ambitions. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
