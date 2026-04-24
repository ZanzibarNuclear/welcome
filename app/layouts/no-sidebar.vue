<script setup lang="ts">
// Layout without sidebar for pages that need full width
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />

    <!-- Main Content Area (Full Width) -->
    <main class="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
      <slot />
    </main>

    <Footer />
  </div>
</template>
