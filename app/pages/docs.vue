<script setup lang="ts">
const { data: page } = await useAsyncData('docs', () => {
  return queryCollection('content').path('/docs').first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
