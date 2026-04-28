<script setup lang="ts">
definePageMeta({ layout: 'no-sidebar' })

useHead({
  title: 'Atomic Ambitions'
})
</script>

<template>
  <div>
    <!-- Hero Photo -->
    <div class="w-full aspect-video bg-gray-200 dark:bg-gray-800">
      <img src="/images/e-buggy.jpg" alt="futuristic buggy" class="w-full h-full object-cover">
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
          In a hurry? Check out the <NuxtLink
to="/simulators/isotope-explorer"
            class="text-cherenkov-400 dark:text-cherenkov-300 underline">isotope explorer</NuxtLink> or <NuxtLink
            to="/simulators/build-an-atom" class="text-cherenkov-400 dark:text-cherenkov-300 underline">atom builder.
          </NuxtLink>
        </p>
      </div>
    </section>

    <!-- Content Areas -->
    <section class="px-6 pb-16">
      <div class="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
to="/lessons"
          class="group flex min-h-64 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-8 no-underline shadow-sm transition hover:-translate-y-1 hover:border-cherenkov-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-cherenkov-500">
          <div>
            <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-cherenkov-500 dark:text-cherenkov-300">
              Fundamentals
            </p>
            <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Atoms and Other Basics
            </h2>
            <p class="leading-relaxed text-gray-600 dark:text-gray-400">
              Build intuition for atoms, isotopes, particles, radiation, and the core ideas behind the physical world.
            </p>
          </div>
          <span
            class="mt-8 font-semibold text-cherenkov-500 transition group-hover:text-cherenkov-600 dark:text-cherenkov-300">
            Start learning
          </span>
        </NuxtLink>

        <NuxtLink
to="/simulators"
          class="group flex min-h-64 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-8 no-underline shadow-sm transition hover:-translate-y-1 hover:border-cherenkov-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-cherenkov-500">
          <div>
            <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-cherenkov-500 dark:text-cherenkov-300">
              Simulators
            </p>
            <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Explore With Models
            </h2>
            <p class="leading-relaxed text-gray-600 dark:text-gray-400">
              Experiment with atoms and isotopes using our interactive models. A safe way to learn about atoms, how they
              are put together, and how they change.
            </p>
          </div>
          <span
            class="mt-8 font-semibold text-cherenkov-500 transition group-hover:text-cherenkov-600 dark:text-cherenkov-300">
            Find some fun
          </span>
        </NuxtLink>

        <NuxtLink
to="/reactors"
          class="group flex min-h-64 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-8 no-underline shadow-sm transition hover:-translate-y-1 hover:border-cherenkov-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-cherenkov-500">
          <div>
            <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-cherenkov-500 dark:text-cherenkov-300">
              Technology
            </p>
            <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Nuclear Reactor Types
            </h2>
            <p class="leading-relaxed text-gray-600 dark:text-gray-400">
              Explore how different reactor designs work, what they are used for, and how they compare.
            </p>
          </div>
          <span
            class="mt-8 font-semibold text-cherenkov-500 transition group-hover:text-cherenkov-600 dark:text-cherenkov-300">
            Explore reactors
          </span>
        </NuxtLink>

        <NuxtLink
to="/blog"
          class="group flex min-h-64 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-8 no-underline shadow-sm transition hover:-translate-y-1 hover:border-cherenkov-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-cherenkov-500">
          <div>
            <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-cherenkov-500 dark:text-cherenkov-300">
              Blog
            </p>
            <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Progress and 'Pinions
            </h2>
            <p class="leading-relaxed text-gray-600 dark:text-gray-400">
              Optimistic views of the evolving world of atomic energy. Topical news and essays from an upbeat
              perspective.
            </p>
          </div>
          <span
            class="mt-8 font-semibold text-cherenkov-500 transition group-hover:text-cherenkov-600 dark:text-cherenkov-300">
            Read the blog
          </span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
