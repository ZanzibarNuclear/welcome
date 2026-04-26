<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
    <Header />

    <!-- Main Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto">
        <article class="mx-auto max-w-4xl px-6 py-12 lg:px-8">
          <div class="prose prose-lg mx-auto w-full">
            <slot />
          </div>
        </article>
      </main>
    </div>

    <Footer />
  </div>
</template>
