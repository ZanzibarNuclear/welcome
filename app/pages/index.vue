<script setup lang="ts">
// Fetch featured content
const { data: featuredBlog } = await useAsyncData('featured-blog', () => {
  return queryCollection('content').where('type', 'blog').where('featured', true).first()
})

const { data: recentBlog } = await useAsyncData('recent-blog', () => {
  return queryCollection('content').where('type', 'blog').sort({ date: -1 }).limit(3).all()
})

const { data: featuredSimulators } = await useAsyncData('featured-simulators', () => {
  return queryCollection('content').where('type', 'simulator').where('featured', true).limit(3).all()
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="py-16 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
          Explore the
          <span
            class="bg-linear-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
            Atomic World
          </span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Discover the fundamental building blocks of our universe through interactive simulators, structured lessons,
          and engaging articles.
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <UButton to="/simulators" size="lg" color="primary">
            Try Simulators
          </UButton>
          <UButton to="/lessons" size="lg" variant="outline" color="primary">
            Start Learning
          </UButton>
        </div>
      </div>
    </section>

    <!-- Featured Content -->
    <section class="py-12 px-6 bg-gray-50 dark:bg-gray-900/50">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured Simulators</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink v-for="sim in featuredSimulators" :key="sim._path" :to="sim._path"
            class="block p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ sim.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">{{ sim.description }}</p>
            <div class="flex items-center gap-2">
              <span
                class="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                {{ sim.difficulty }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Blog Posts -->
    <section class="py-12 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Latest Articles</h2>
          <UButton to="/blog" variant="ghost" trailing-icon="i-heroicons-arrow-right">
            View All
          </UButton>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink v-for="post in recentBlog" :key="post._path" :to="post._path"
            class="block p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ post.date }}</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ post.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">{{ post.excerpt }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-6 bg-primary-600 dark:bg-primary-700">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
        <p class="text-xl text-primary-100 mb-8">
          Begin your journey into atomic physics with our structured lesson paths.
        </p>
        <UButton to="/lessons" size="lg" color="white" variant="solid">
          Browse Lessons
        </UButton>
      </div>
    </section>
  </div>
</template>
