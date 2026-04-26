<template>
  <div class="space-y-6">
    <div class="rounded-2xl bg-linear-to-br from-cherenkov-500/10 to-primary-500/10 p-6 dark:from-cherenkov-400/10 dark:to-primary-400/10">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-2xl">
          <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-cherenkov-600 dark:text-cherenkov-300">
            External Interactive Tool
          </p>
          <h3 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            Open the Isotope Explorer
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            Use the explorer to move across elements and compare isotopes by proton count,
            neutron count, stability, and decay behavior.
          </p>
        </div>

        <UButton
          to="https://isotopes.atomicambitions.com"
          target="_blank"
          rel="noopener noreferrer"
          trailing-icon="i-heroicons-arrow-top-right-on-square"
          size="xl"
          color="primary">
          Launch Explorer
        </UButton>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          1. Choose an Element
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Start with carbon, hydrogen, iodine, uranium, or another element you recognize.
        </p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          2. Compare Isotopes
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Notice that the element stays the same while neutron counts and mass numbers change.
        </p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          3. Check Stability
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Look for which isotopes are stable, which decay, and what each radioactive isotope becomes.
        </p>
      </div>
    </div>
  </div>
</template>
