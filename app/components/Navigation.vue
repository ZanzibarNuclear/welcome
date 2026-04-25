<template>
  <nav class="p-6 space-y-1">
    <h3 class="px-3 mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      Explore
    </h3>
    <NuxtLink to="/lessons"
      class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold">
      <span class="w-1.5 h-1.5 rounded-full bg-current mr-3 opacity-50"></span>
      Lessons
    </NuxtLink>
    <NuxtLink to="/simulators"
      class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold">
      <span class="w-1.5 h-1.5 rounded-full bg-current mr-3 opacity-50"></span>
      Simulators
    </NuxtLink>
    <NuxtLink to="/reactors"
      class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold">
      <span class="w-1.5 h-1.5 rounded-full bg-current mr-3 opacity-50"></span>
      Reactors
    </NuxtLink>
  </nav>
</template>
