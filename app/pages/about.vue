<script setup lang="ts">
const { data: page } = await useAsyncData('about', () => {
  return queryCollection('content').path('/pages/about').first()
})

useHead({
  title: page.value?.title,
  meta: [
    { name: 'description', content: page.value?.description }
  ]
})
</script>

<template>
  <div>
    <ContentRenderer v-if="page" :value="page" />
    <ClientOnly>
      <VisitStatsWidget />
    </ClientOnly>
  </div>
</template>
