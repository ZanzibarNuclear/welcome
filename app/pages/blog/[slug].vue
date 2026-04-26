<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Fetch the blog post
const { data: post } = await useAsyncData(`blog-${slug}`, () => {
  return queryCollection('content').path(`/blog/${slug}`).first()
})

// 404 if not found
if (!post.value) {
  throw createError({ statusCode: 404, message: 'Blog post not found' })
}

const { data: allPosts } = await useAsyncData('blog-navigation', async () => {
  const items = await queryCollection('content').all()
  return items
    .filter(item => item.type === 'blog')
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
})

const currentIndex = computed(() => {
  return allPosts.value?.findIndex(item => item.path === post.value?.path) ?? -1
})

const newerPost = computed(() => {
  if (!allPosts.value || currentIndex.value <= 0) return null
  return allPosts.value[currentIndex.value - 1]
})

const olderPost = computed(() => {
  if (!allPosts.value || currentIndex.value === -1 || currentIndex.value >= allPosts.value.length - 1) return null
  return allPosts.value[currentIndex.value + 1]
})

// Meta tags
useHead({
  title: post.value.title,
  meta: [
    { name: 'description', content: post.value.excerpt || post.value.description }
  ]
})
</script>

<template>
  <article v-if="post">
    <!-- Article Header -->
    <header class="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <time>{{ post.date }}</time>
        <span v-if="post.author">· {{ post.author }}</span>
      </div>

      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
        {{ post.title }}
      </h1>

      <div v-if="post.tags" class="flex flex-wrap gap-2">
        <span
v-for="tag in post.tags" :key="tag"
          class="text-sm px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
          {{ tag }}
        </span>
      </div>
    </header>

    <!-- Article Content -->
    <ContentRenderer :value="post" class="prose prose-lg" />

    <!-- Article Footer -->
    <footer class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <nav class="grid gap-4 md:grid-cols-2">
        <NuxtLink
          :to="newerPost ? newerPost.path : '/blog'"
          class="rounded-xl border border-gray-200 p-5 transition hover:border-primary-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-primary-500 dark:hover:bg-gray-900/50">
          <div class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Newer
          </div>
          <div class="font-semibold text-gray-900 dark:text-white">
            {{ newerPost ? newerPost.title : 'Back to Blog' }}
          </div>
        </NuxtLink>

        <NuxtLink
          :to="olderPost ? olderPost.path : '/blog'"
          class="rounded-xl border border-gray-200 p-5 text-right transition hover:border-primary-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-primary-500 dark:hover:bg-gray-900/50">
          <div class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Older
          </div>
          <div class="font-semibold text-gray-900 dark:text-white">
            {{ olderPost ? olderPost.title : 'Back to Blog' }}
          </div>
        </NuxtLink>
      </nav>
    </footer>
  </article>
</template>
