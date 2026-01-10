<script setup lang="ts">
// Fetch all lessons
const { data: lessons } = await useAsyncData('lessons', () => {
  return queryCollection('content').where('type', 'lesson').sort({ order: 1 }).all()
})

// Fetch the index page content
const { data: indexPage } = await useAsyncData('lessons-index', () => {
  return queryCollection('content').path('/lessons').first()
})

// Group lessons by series
const lessonsBySeries = computed(() => {
  if (!lessons.value) return {}
  return lessons.value.reduce((acc: any, lesson: any) => {
    const series = lesson.series || 'Other'
    if (!acc[series]) acc[series] = []
    acc[series].push(lesson)
    return acc
  }, {})
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-12">
      <ContentRenderer v-if="indexPage" :value="indexPage" class="prose prose-lg" />
    </div>

    <!-- Lessons by Series -->
    <div class="space-y-12">
      <section v-for="(seriesLessons, seriesName) in lessonsBySeries" :key="seriesName">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ seriesName }}</h2>
        
        <div class="space-y-4">
          <article v-for="lesson in seriesLessons" :key="lesson._path"
            class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-primary-500 dark:hover:border-primary-500 transition-all">
            <NuxtLink :to="lesson._path" class="block p-6">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <!-- Order Badge -->
                  <div class="flex items-center gap-3 mb-2">
                    <span v-if="lesson.order"
                      class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold text-sm">
                      {{ lesson.order }}
                    </span>
                    <span
                      class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {{ lesson.difficulty }}
                    </span>
                    <span v-if="lesson.duration" class="text-sm text-gray-500 dark:text-gray-400">
                      {{ lesson.duration }} min
                    </span>
                  </div>

                  <!-- Title and Description -->
                  <h3
                    class="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {{ lesson.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ lesson.description }}
                  </p>
                </div>

                <!-- Quiz Badge -->
                <div v-if="lesson.quiz"
                  class="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400">
                  <UIcon name="i-heroicons-academic-cap" />
                  <span>Quiz</span>
                </div>
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>
    </div>

    <!-- Empty State -->
    <div v-if="!lessons || lessons.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">No lessons yet. Check back soon!</p>
    </div>
  </div>
</template>
