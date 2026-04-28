<script setup lang="ts">
const { data: reactors } = await useAsyncData('reactors', async () => {
  const items = await queryCollection('content').all()
  return items
    .filter((item) => item.type === 'reactor')
    .sort((a, b) => {
      const generationCompare = (a.generation || '').localeCompare(b.generation || '')
      return generationCompare || (a.order || 999) - (b.order || 999)
    })
})

const { data: indexPage } = await useAsyncData('reactors-index', () => {
  return queryCollection('content').path('/reactors').first()
})

useHead({
  title: indexPage.value?.title
})

type Reactor = NonNullable<typeof reactors.value>[number]

const reactorsByGeneration = computed(() => {
  if (!reactors.value) return {}

  return reactors.value.reduce<Record<string, Reactor[]>>((groups, reactor) => {
    const generation = reactor.generation || 'Other Reactors'
    groups[generation] ||= []
    groups[generation].push(reactor)
    return groups
  }, {})
})
</script>

<template>
  <div>
    <div class="mb-12">
      <ContentRenderer v-if="indexPage" :value="indexPage" class="prose prose-lg" />
    </div>

    <div class="prose prose-lg">
      <section v-for="(generationReactors, generation) in reactorsByGeneration" :key="generation">
        <h2>{{ generation }}</h2>
        <ul>
          <li v-for="reactor in generationReactors" :key="reactor.path">
            <NuxtLink :to="reactor.path">
              {{ reactor.title }}
            </NuxtLink>
            - {{ reactor.description }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
