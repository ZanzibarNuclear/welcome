<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div class="px-4 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Links -->
        <nav class="flex flex-wrap items-center gap-4 text-sm">
          <NuxtLink
            to="/contact"
            class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Contact
          </NuxtLink>
          <NuxtLink
            to="/privacy"
            class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Privacy Policy
          </NuxtLink>
          <NuxtLink
            to="/terms"
            class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Terms of Use
          </NuxtLink>
        </nav>

        <!-- Copyright -->
        <div class="text-sm text-gray-600 dark:text-gray-400">
          © {{ currentYear }} All rights reserved.
        </div>
      </div>
    </div>
  </footer>
</template>
