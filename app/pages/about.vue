<script setup lang="ts">
const { data: page } = await useAsyncData('about', () => {
  return queryCollection('content').path('/pages/about').first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
