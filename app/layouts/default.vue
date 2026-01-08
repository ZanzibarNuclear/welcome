<script setup lang="ts">
const route = useRoute()
const showSidebar = computed(() => {
  // Check if page has hideSidebar meta
  return !route.meta.hideSidebar
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />

    <!-- Main Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar -->
      <aside v-if="showSidebar"
        class="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto">
        <Navigation />
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
        <div class="p-6 text-gray-900 dark:text-gray-100">
          <slot />
        </div>
      </main>
    </div>

    <Footer />
  </div>
</template>
