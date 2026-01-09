<script setup lang="ts">
const { data: page } = await useAsyncData('guides', () => {
  return queryCollection('content').path('/guides').first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
