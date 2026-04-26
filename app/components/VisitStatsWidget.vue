<script setup lang="ts">
const {
  daysVisited,
  firstVisitDate,
  lastVisitDate,
  visitorId,
  hasVisitedBefore,
  isReturningVisitor
} = useVisitStats()

const dayLabel = computed(() => daysVisited.value === 1 ? 'day' : 'days')
const visitorStatus = computed(() => {
  if (!hasVisitedBefore.value) {
    return 'New visitor'
  }

  return isReturningVisitor.value ? 'Returning visitor' : 'First visit today'
})
const shortVisitorId = computed(() => visitorId.value ? visitorId.value.slice(0, 8) : 'pending')
</script>

<template>
  <aside
    class="not-prose mt-10 rounded-2xl border border-cherenkov-200 bg-cherenkov-50/70 p-6 shadow-sm dark:border-cherenkov-800 dark:bg-cherenkov-950/40"
    aria-labelledby="visit-stats-title"
  >
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-wider text-cherenkov-700 dark:text-cherenkov-300">
          Your Visit Stats
        </p>
        <h2 id="visit-stats-title" class="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
          {{ visitorStatus }}
        </h2>
        <p class="mt-2 max-w-xl text-sm leading-6 text-gray-700 dark:text-gray-300">
          This browser has a first-party visitor cookie so Atomic Ambitions can count one visit per calendar day.
        </p>
      </div>

      <div class="rounded-xl bg-white px-5 py-4 text-center shadow-sm dark:bg-gray-900">
        <p class="text-4xl font-extrabold text-cherenkov-600 dark:text-cherenkov-300">
          {{ daysVisited }}
        </p>
        <p class="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
          {{ dayLabel }} visited
        </p>
      </div>
    </div>

    <dl class="mt-6 grid gap-4 text-sm sm:grid-cols-3">
      <div>
        <dt class="font-semibold text-gray-900 dark:text-white">
          First visit
        </dt>
        <dd class="mt-1 text-gray-600 dark:text-gray-400">
          {{ firstVisitDate || 'Today' }}
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-gray-900 dark:text-white">
          Latest visit
        </dt>
        <dd class="mt-1 text-gray-600 dark:text-gray-400">
          {{ lastVisitDate || 'Today' }}
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-gray-900 dark:text-white">
          Visitor cookie
        </dt>
        <dd class="mt-1 font-mono text-gray-600 dark:text-gray-400">
          {{ shortVisitorId }}
        </dd>
      </div>
    </dl>
  </aside>
</template>
