<script setup lang="ts">
// Fetch all blog posts
const { data: posts } = await useAsyncData('blog-posts', async () => {
  const items = await queryCollection('content').all()
  return items
    .filter(item => item.type === 'blog')
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
})

// Fetch the index page content
const { data: indexPage } = await useAsyncData('blog-index', () => {
  return queryCollection('content').path('/blog').first()
})

useHead({
  title: indexPage.value?.title
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-12">
      <ContentRenderer v-if="indexPage" :value="indexPage" class="prose prose-lg" />
    </div>

    <div class="prose prose-lg">
      <h2>Recent Posts</h2>
      <ul v-if="posts?.length">
        <li v-for="post in posts" :key="post.path">
          <NuxtLink :to="post.path">
            {{ post.title }}
          </NuxtLink>
          <span v-if="post.date"> - {{ post.date }}</span>
          <span v-if="post.excerpt"> - {{ post.excerpt }}</span>
        </li>
      </ul>
      <p v-else>No blog posts yet. Check back soon!</p>
    </div>
  </div>
</template>
