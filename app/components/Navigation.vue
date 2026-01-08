<template>
  <nav class="p-4 space-y-2">
    <NuxtLink
      to="/"
      class="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
    >
      Home
    </NuxtLink>
    <NuxtLink
      to="/docs"
      class="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
    >
      Documentation
    </NuxtLink>
    <NuxtLink
      to="/guides"
      class="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
    >
      Guides
    </NuxtLink>
  </nav>
</template>
