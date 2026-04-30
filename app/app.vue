<script setup lang="ts">
useHead({
  titleTemplate: title => title && title !== 'Atomic Ambitions'
    ? `Atomic | ${title}`
    : 'Atomic Ambitions'
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
