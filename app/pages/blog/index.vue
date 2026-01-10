<script setup lang="ts">
// Fetch all blog posts
const { data: posts } = await useAsyncData('blog-posts', async () => {
  const items = await queryCollection('content').path('/blog').all()
  return items
    .filter((item: any) => item.type === 'blog')
    .sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
})

// Fetch the index page content
const { data: indexPage } = await useAsyncData('blog-index', () => {
  return queryCollection('content').path('/blog').first()
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-12">
      <ContentRenderer v-if="indexPage" :value="indexPage" class="prose prose-lg" />
    </div>

    <!-- Blog Posts Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article v-for="post in posts" :key="(post as any).path"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg">
        <NuxtLink :to="(post as any).path" class="block">
          <div class="p-6">
            <!-- Meta Info -->
            <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <time>{{ post.date }}</time>
              <span v-if="post.author">· {{ post.author }}</span>
            </div>

            <!-- Title and Excerpt -->
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {{ post.title }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ post.excerpt }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in post.tags" :key="tag"
                class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                {{ tag }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </article>
    </div>

    <!-- Empty State -->
    <div v-if="!posts || posts.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">No blog posts yet. Check back soon!</p>
    </div>
  </div>
</template>
