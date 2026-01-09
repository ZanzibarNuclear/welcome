<script setup lang="ts">
const { data: page } = await useAsyncData('simulators', () => {
  return queryCollection('content').path('/simulators').first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
