<script setup lang="ts">
definePageMeta({ layout: 'no-sidebar' })
</script>

<template>
  <div>
    <!-- Hero Photo -->
    <div class="w-full aspect-video bg-gray-200 dark:bg-gray-800">
      <img src="/images/e-buggy.jpg" alt="futuristic buggy" class="w-full h-full object-cover" />
    </div>

    <!-- Hero Text -->
    <section class="py-16 px-6 flex flex-col items-center text-center">
      <div class="max-w-3xl">
        <h1 class="text-5xl font-extrabold text-cherenkov-400 dark:text-cherenkov-300 mb-6 tracking-tight">Everything is
          Atoms</h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Discover the fundamental building blocks of our universe.
        </p>
        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
          Get a taste of what's to come on this website. Try the <NuxtLink to="https://isotopes.atomicambitions.com"
            class="text-cherenkov-400 dark:text-cherenkov-300 underline">isotope explorer</NuxtLink>.
        </p>
      </div>
    </section>
  </div>
</template>
