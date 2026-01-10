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
        <span v-for="tag in post.tags" :key="tag"
          class="text-sm px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
          {{ tag }}
        </span>
      </div>
    </header>

    <!-- Article Content -->
    <ContentRenderer :value="post" class="prose prose-lg" />

    <!-- Article Footer -->
    <footer class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div class="flex justify-between items-center">
        <UButton to="/blog" variant="ghost" leading-icon="i-heroicons-arrow-left">
          Back to Blog
        </UButton>
        <div class="flex gap-2">
          <UButton variant="ghost" icon="i-heroicons-share" aria-label="Share article" />
        </div>
      </div>
    </footer>
  </article>
</template>
