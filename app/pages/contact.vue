<script setup lang="ts">
const { data: page } = await useAsyncData('contact', () => {
  return queryCollection('content').path('/pages/contact').first()
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
