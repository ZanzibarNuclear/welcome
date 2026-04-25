<script setup lang="ts">
const { data: page } = await useAsyncData('policies', () => {
  return queryCollection('content').path('/pages/policies').first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
