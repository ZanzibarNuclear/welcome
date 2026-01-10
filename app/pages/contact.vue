<script setup lang="ts">
const { data: page } = await useAsyncData('contact', () => {
  return queryCollection('content').path('/pages/contact').first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
