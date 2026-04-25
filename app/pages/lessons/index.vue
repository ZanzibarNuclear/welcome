<script setup lang="ts">
const { data: lessons } = await useAsyncData('lessons', async () => {
  const items = await queryCollection('content').all()
  return items
    .filter((item: any) => item.type === 'lesson')
    .sort((a: any, b: any) => {
      const seriesCompare = (a.series || '').localeCompare(b.series || '')
      return seriesCompare || (a.order || 999) - (b.order || 999)
    })
})

// Fetch the index page content
const { data: indexPage } = await useAsyncData('lessons-index', () => {
  return queryCollection('content').path('/lessons').first()
})

const lessonsBySeries = computed(() => {
  if (!lessons.value) return {}

  return lessons.value.reduce((groups: Record<string, any[]>, lesson: any) => {
    const series = lesson.series || 'Other Lessons'
    groups[series] ||= []
    groups[series].push(lesson)
    return groups
  }, {})
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-12">
      <ContentRenderer v-if="indexPage" :value="indexPage" class="prose prose-lg" />
    </div>

    <div class="prose prose-lg">
      <section v-for="(seriesLessons, seriesName) in lessonsBySeries" :key="seriesName">
        <h2>{{ seriesName }}</h2>
        <ul>
          <li v-for="lesson in seriesLessons" :key="(lesson as any).path">
            <NuxtLink :to="(lesson as any).path">
              {{ lesson.title }}
            </NuxtLink>
            - {{ lesson.description }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
