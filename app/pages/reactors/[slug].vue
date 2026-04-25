<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: reactor } = await useAsyncData(`reactor-${slug}`, () => {
  return queryCollection('content').path(`/reactors/${slug}`).first()
})

if (!reactor.value) {
  throw createError({ statusCode: 404, message: 'Reactor not found' })
}

useHead({
  title: reactor.value.title,
  meta: [
    { name: 'description', content: reactor.value.description }
  ]
})
</script>

<template>
  <article v-if="reactor">
    <header class="mb-8 border-b border-gray-200 pb-8 dark:border-gray-800">
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <span v-if="reactor.generation"
          class="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
          {{ reactor.generation }}
        </span>
        <span v-if="reactor.status" class="text-sm text-gray-500 dark:text-gray-400">
          {{ reactor.status }}
        </span>
      </div>

      <h1 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white">
        {{ reactor.title }}
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        {{ reactor.description }}
      </p>

      <dl class="mt-8 grid gap-4 md:grid-cols-3">
        <div v-if="reactor.coolant"
          class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
          <dt class="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Coolant</dt>
          <dd class="font-semibold text-gray-900 dark:text-white">{{ reactor.coolant }}</dd>
        </div>
        <div v-if="reactor.moderator"
          class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
          <dt class="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Moderator</dt>
          <dd class="font-semibold text-gray-900 dark:text-white">{{ reactor.moderator }}</dd>
        </div>
        <div v-if="reactor.fuel"
          class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
          <dt class="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Fuel</dt>
          <dd class="font-semibold text-gray-900 dark:text-white">{{ reactor.fuel }}</dd>
        </div>
      </dl>
    </header>

    <ContentRenderer :value="reactor" class="prose prose-lg" />

    <footer class="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
      <UButton to="/reactors" variant="ghost" leading-icon="i-heroicons-arrow-left">
        All Reactors
      </UButton>
    </footer>
  </article>
</template>
