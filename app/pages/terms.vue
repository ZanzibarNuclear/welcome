<script setup lang="ts">
const { data: page } = await useAsyncData('terms', () => {
  return queryCollection('content').path('/pages/terms').first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
