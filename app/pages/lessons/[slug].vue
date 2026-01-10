<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Fetch the lesson
const { data: lesson } = await useAsyncData(`lesson-${slug}`, () => {
  return queryCollection('content').path(`/lessons/${slug}`).first()
})

// 404 if not found
if (!lesson.value) {
  throw createError({ statusCode: 404, message: 'Lesson not found' })
}

// Meta tags
useHead({
  title: lesson.value.title,
  meta: [
    { name: 'description', content: lesson.value.description }
  ]
})
</script>

<template>
  <article v-if="lesson">
    <!-- Lesson Header -->
    <header class="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <span
          class="text-sm px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium">
          {{ lesson.difficulty }}
        </span>
        <span v-if="lesson.duration" class="text-sm text-gray-500 dark:text-gray-400">
          <UIcon name="i-heroicons-clock" class="inline" />
          {{ lesson.duration }} minutes
        </span>
        <span v-if="lesson.quiz" class="text-sm text-primary-600 dark:text-primary-400">
          <UIcon name="i-heroicons-academic-cap" class="inline" />
          Includes Quiz
        </span>
      </div>

      <div v-if="lesson.series" class="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {{ lesson.series }}
        <span v-if="lesson.order"> · Lesson {{ lesson.order }}</span>
      </div>

      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        {{ lesson.title }}
      </h1>
    </header>

    <!-- Lesson Content -->
    <ContentRenderer :value="lesson" class="prose prose-lg" />

    <!-- Lesson Footer -->
    <footer class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div class="flex justify-between items-center">
        <UButton to="/lessons" variant="ghost" leading-icon="i-heroicons-arrow-left">
          Back to Lessons
        </UButton>
        <div class="flex gap-2">
          <UButton variant="outline" color="primary">
            Mark Complete
          </UButton>
        </div>
      </div>
    </footer>
  </article>
</template>
