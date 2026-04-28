<script setup lang="ts">
const { data: page } = await useAsyncData('policies', () => {
  return queryCollection('content').path('/pages/policies').first()
})

useHead({
  title: page.value?.title,
  meta: [
    { name: 'description', content: page.value?.description }
  ]
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
