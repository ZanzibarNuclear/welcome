<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => {
  return queryCollection('content').path('/').first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>

