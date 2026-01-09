<script setup lang="ts">
const { data: page } = await useAsyncData('about', () => {
  return queryCollection('content').path('/about').first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
