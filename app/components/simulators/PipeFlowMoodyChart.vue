<script setup lang="ts">
import { computed } from 'vue'
import { frictionFactorForMoodyCurve, REYNOLDS_LAMINAR_UPPER } from '~~/utils/fluidMechanics'

const props = defineProps<{
  reynolds: number
  relativeRoughness: number
  friction: number
}>()

const RE_MIN = 600
const RE_MAX = 1e8
const F_MIN = 0.008
const F_MAX = 0.1

const PL = 54
const PB = 36
const W = 340
const H = 210
const PW = W - PL - 14
const PH = H - PB - 12

function xRe(Re: number) {
  const t =
    (Math.log10(Re) - Math.log10(RE_MIN)) / (Math.log10(RE_MAX) - Math.log10(RE_MIN))
  return PL + clamp(t, 0, 1) * PW
}

function yF(f: number) {
  const ff = clamp(f, F_MIN * 0.95, F_MAX * 1.05)
  const t =
    (Math.log10(ff) - Math.log10(F_MIN)) / (Math.log10(F_MAX) - Math.log10(F_MIN))
  return 12 + (1 - clamp(t, 0, 1)) * PH
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

/** ε/D curves (dimensionless); 0 ≈ hydraulically smooth. */
const REL_ROUGHS = [0, 1e-5, 5e-5, 1e-4, 2e-4, 5e-4, 1e-3, 2e-3, 4e-3, 0.01, 0.02, 0.05]

const curvePaths = computed(() => {
  const steps = 72
  return REL_ROUGHS.map((rel) => {
    const parts: string[] = []
    for (let i = 0; i <= steps; i++) {
      const logRe =
        Math.log10(RE_MIN) + (i / steps) * (Math.log10(RE_MAX) - Math.log10(RE_MIN))
      const Re = 10 ** logRe
      const f = frictionFactorForMoodyCurve(rel, Re)
      if (!Number.isFinite(f) || f <= 0) continue
      const x = xRe(Re)
      const y = yF(f)
      parts.push(`${parts.length === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    return { rel, d: parts.join(' ') }
  })
})

const laminarPath = computed(() => {
  const parts: string[] = []
  const n = 24
  for (let i = 0; i <= n; i++) {
    const Re = RE_MIN + (i / n) * (REYNOLDS_LAMINAR_UPPER - RE_MIN)
    const f = 64 / Math.max(Re, 1)
    const x = xRe(Re)
    const y = yF(f)
    parts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return parts.join(' ')
})

const dotPos = computed(() => {
  const Re = Math.max(props.reynolds, RE_MIN * 0.9)
  const f = clamp(props.friction, F_MIN, F_MAX)
  return { cx: xRe(Re), cy: yF(f) }
})

const xTicks = [1e3, 1e4, 1e5, 1e6, 1e7]

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'

function formatReTick(re: number) {
  const e = Math.round(Math.log10(re))
  const exp = Math.abs(e)
    .toString()
    .split('')
    .map((d) => SUP[parseInt(d, 10)] ?? d)
    .join('')
  return e < 0 ? `10⁻${exp}` : `10${exp}`
}
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950/50">
    <div class="mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">Moody-style diagram (Darcy f)</div>
    <svg
      :viewBox="`0 0 ${W} ${H}`"
      class="h-auto w-full max-w-md text-gray-700 dark:text-gray-300"
      role="img"
      aria-label="Log log plot of friction factor versus Reynolds number">
      <g opacity="0.35" class="stroke-gray-400 dark:stroke-gray-600" stroke-width="0.5">
        <line
          v-for="(xr, ti) in xTicks"
          :key="ti"
          :x1="xRe(xr)"
          :x2="xRe(xr)"
          y1="12"
          :y2="12 + PH" />
        <line
          v-for="fi in [0.01, 0.02, 0.03, 0.05, 0.08]"
          :key="fi"
          :x1="PL"
          :x2="PL + PW"
          :y1="yF(fi)"
          :y2="yF(fi)" />
      </g>
      <text :x="PL + PW / 2" :y="H - 6" text-anchor="middle" class="fill-gray-500 text-[10px]">
        Reynolds number Re (log scale)
      </text>
      <text
        x="10"
        :y="12 + PH / 2"
        class="fill-gray-500 text-[10px]"
        transform="rotate(-90 10 105)">
        Darcy f (log scale)
      </text>
      <text
        v-for="xr in xTicks"
        :key="'t' + xr"
        :x="xRe(xr)"
        :y="H - 18"
        text-anchor="middle"
        class="fill-gray-500 text-[9px]">
        {{ formatReTick(xr) }}
      </text>
      <path
        :d="laminarPath"
        fill="none"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-dasharray="5 4"
        class="text-violet-500 dark:text-violet-400" />
      <path
        v-for="c in curvePaths"
        :key="c.rel"
        :d="c.d"
        fill="none"
        stroke="currentColor"
        stroke-width="0.85"
        class="text-sky-600/70 dark:text-sky-400/60" />
      <circle
        :cx="dotPos.cx"
        :cy="dotPos.cy"
        r="5"
        class="fill-amber-500 stroke-white dark:stroke-gray-900"
        stroke-width="1.5" />
      <text x="PL + PW - 2" y="22" text-anchor="end" class="fill-gray-400 text-[9px]">
        Dashed: laminar f = 64/Re
      </text>
    </svg>
    <p class="mt-2 text-[11px] leading-snug text-gray-500 dark:text-gray-400">
      Curves use the same Swamee–Jain / laminar model as the simulator. Amber dot: your Re and f; ε/D =
      {{ relativeRoughness < 1e-4 ? relativeRoughness.toExponential(2) : relativeRoughness.toFixed(4) }}.
    </p>
  </div>
</template>
