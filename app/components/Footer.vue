<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Links -->
        <nav class="flex flex-wrap items-center gap-6 text-sm">
          <NuxtLink
            to="/contact"
            class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
          >
            Contact
          </NuxtLink>
          <NuxtLink
            to="/privacy"
            class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
          >
            Privacy Policy
          </NuxtLink>
          <NuxtLink
            to="/terms"
            class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
          >
            Terms of Use
          </NuxtLink>
        </nav>

        <!-- Logo + Copyright -->
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
