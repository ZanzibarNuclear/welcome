<script setup lang="ts">
// Layout without sidebar for pages that need full width
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />

    <!-- Main Content Area (Full Width) -->
    <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div class="p-6 text-gray-900 dark:text-gray-100">
        <slot />
      </div>
    </main>
  </div>
</template>
