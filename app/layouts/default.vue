<script setup lang="ts">
const route = useRoute()

// Show sidebar only on specific content detail pages
const showSidebar = computed(() => {
  const path = route.path
  // Show sidebar on detail pages (with slugs) but not on list/index pages
  return (
    (path.startsWith('/lessons/') && path !== '/lessons' && path !== '/lessons/') ||
    (path.startsWith('/simulators/') && path !== '/simulators' && path !== '/simulators/') ||
    (path.startsWith('/reactors/') && path !== '/reactors' && path !== '/reactors/')
  )
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
    <Header />

    <!-- Main Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar -->
      <aside
        v-if="showSidebar"
        class="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto sticky top-0 h-screen">
        <Navigation />
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto">
        <article class="mx-auto max-w-4xl px-6 py-12 lg:px-8">
          <div class="prose prose-lg">
            <slot />
          </div>
        </article>
      </main>
    </div>

    <Footer />
  </div>
</template>
