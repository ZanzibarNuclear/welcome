<script setup lang="ts">
const { data: page } = await useAsyncData('privacy', () => {
  return queryCollection('content').path('/pages/privacy').first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
