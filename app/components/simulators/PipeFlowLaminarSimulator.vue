<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from "vue";
import {
  fluidProperties,
  pipeCrossSectionArea,
  pressureDropHagenPoiseuille,
  reynoldsNumber,
  REYNOLDS_LAMINAR_UPPER,
  volumeFlowForReynolds,
} from "~~/utils/fluidMechanics";

const colorMode = useColorMode();

/**
 * Cross-section: lightest blue at center (fastest), darker rings toward the wall
 * (slower). Side-view drips / tanks use mid blue.
 */
const flowGradientVars = computed(() =>
  colorMode.value === "dark"
    ? {
        "--flow-core": "#7dd3fc",
        "--flow-deep": "#075985",
        "--flow-center": "#38bdf8",
        "--flow-wall": "rgb(30 41 59 / 0.92)",
      }
    : {
        "--flow-core": "#e0f2fe",
        "--flow-deep": "#075985",
        "--flow-center": "#0ea5e9",
        "--flow-wall": "rgb(243 244 246 / 0.98)",
      },
);

/** Stacked filled circles (drawn outer → inner) give visible laminar “layers.” */
const CROSS_SECTION_DISK_R = 43.35;
const CROSS_SECTION_LAYER_N = 11;

const crossSectionLayers = computed(() => {
  const layers: { r: number; fill: string }[] = [];
  for (let i = CROSS_SECTION_LAYER_N; i >= 1; i--) {
    const r = (CROSS_SECTION_DISK_R * i) / CROSS_SECTION_LAYER_N;
    const t =
      CROSS_SECTION_LAYER_N <= 1 ? 0 : (i - 1) / (CROSS_SECTION_LAYER_N - 1);
    const a = (1 - t) * 100;
    const b = t * 100;
    layers.push({
      r,
      fill: `color-mix(in oklch, var(--flow-core) ${a}%, var(--flow-deep) ${b}%)`,
    });
  }
  return layers;
});

/**
 * Select options only—order-of-magnitude labels (not as-built routing).
 * 5–80 m in 5 m steps.
 */
const PIPE_LENGTH_OPTIONS: { m: number; note: string }[] = [
  {
    m: 5,
    note: "Short rack straight: a few supports; tie-in between nearby valves",
  },
  {
    m: 10,
    note: "One wide structural bay; short run inside a turbine or auxiliary hall",
  },
  {
    m: 20,
    note: "Typical run between two major skids (e.g. pump to nearby heat exchanger)",
  },
  {
    m: 30,
    note: "Long in-building header; several pipe-rack modules end-to-end",
  },
  {
    m: 40,
    note: "Multi-turn routing in one large building before heading outdoors",
  },
  {
    m: 50,
    note: "Long tunnel / trench straight; half a football-field scale on the ground",
  },
  {
    m: 60,
    note: "Extended yard routing on one rack before a major elevation or turn",
  },
  {
    m: 70,
    note: "Large outdoor pipe-bridge or rack section across part of a site",
  },
  {
    m: 80,
    note: "Upper end of this lab—very long buried or yard run",
  },
];

/** Always show Δp in Pa with enough digits that small changes stay visible. */
function formatPressureDropPa(pa: number): string {
  if (!Number.isFinite(pa)) return "—";
  const a = Math.abs(pa);
  if (a >= 1000)
    return `${Math.round(pa).toLocaleString(undefined, { maximumFractionDigits: 0 })} Pa`;
  if (a >= 100)
    return `${pa.toLocaleString(undefined, { maximumFractionDigits: 1 })} Pa`;
  if (a >= 10)
    return `${pa.toLocaleString(undefined, { maximumFractionDigits: 2 })} Pa`;
  if (a >= 1)
    return `${pa.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })} Pa`;
  if (a >= 0.01)
    return `${pa.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} Pa`;
  return `${pa.toLocaleString(undefined, { maximumFractionDigits: 6 })} Pa`;
}

/** Fixed teaching values: liquid water at 40 °C (site ρ, μ tables). */
const WATER_TEMP_C = 40;

/**
 * Nominal inner diameters for teaching (real plants use schedule / drawing values).
 * Ordered small → large: instrumentation, SG tubes, process, steam/feed, primary loop, CW.
 */
const DIAMETER_PRESETS = [
  { id: "sg-tube", mm: 15, label: "Steam generator heat-exchanger tube" },
  { id: "service", mm: 40, label: "Small process branch / drain line" },
  { id: "aux-steam", mm: 100, label: "Chemical feed header" },
  { id: "feedwater", mm: 250, label: "Main feedwater" },
  { id: "main-steam", mm: 400, label: "Main steam header" },
  { id: "primary-loop", mm: 700, label: "Primary loop hot / cold leg" },
  { id: "cw", mm: 1200, label: "Condenser circulating water" },
] as const;

type DiameterPresetId = (typeof DIAMETER_PRESETS)[number]["id"];

const diameterPresetId = ref<DiameterPresetId>("feedwater");

const diameterM = computed(() => {
  const p = DIAMETER_PRESETS.find((x) => x.id === diameterPresetId.value);
  return (p?.mm ?? 250) / 1000;
});

const lengthM = ref(20);

const Q_SLIDER_STEPS = 1000;
/** 0 … this fraction of the bar: Q from 0 up to laminar-cap flow; remainder: up to `RE_SLIDER_EXTEND`. */
const Q_SLIDER_LAMINAR_FRACTION = 0.75;
/** Top of the last slider segment: transitional / early turbulent onset (formula still shown, with warning). */
const RE_SLIDER_EXTEND = 4000;

const flowSlider = ref(450);

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

const rho = computed(() => fluidProperties("water", WATER_TEMP_C).rho);
const mu = computed(() => fluidProperties("water", WATER_TEMP_C).mu);
const area = computed(() => pipeCrossSectionArea(diameterM.value));

/** Q (L/s) at Re = REYNOLDS_LAMINAR_UPPER for current water properties and D. */
const qAtLaminarCapLs = computed(
  () =>
    volumeFlowForReynolds(
      REYNOLDS_LAMINAR_UPPER,
      rho.value,
      diameterM.value,
      mu.value,
    ) * 1000,
);

const qAtExtendLs = computed(
  () =>
    volumeFlowForReynolds(
      RE_SLIDER_EXTEND,
      rho.value,
      diameterM.value,
      mu.value,
    ) * 1000,
);

const flowLs = computed(() => {
  const s = clamp(flowSlider.value / Q_SLIDER_STEPS, 0, 1);
  const qLam = qAtLaminarCapLs.value;
  const qHi = qAtExtendLs.value;
  if (s <= Q_SLIDER_LAMINAR_FRACTION) {
    return (s / Q_SLIDER_LAMINAR_FRACTION) * qLam;
  }
  const t = (s - Q_SLIDER_LAMINAR_FRACTION) / (1 - Q_SLIDER_LAMINAR_FRACTION);
  return qLam + t * (qHi - qLam);
});

const Qm3s = computed(() => flowLs.value / 1000);

const velocity = computed(() => Qm3s.value / Math.max(area.value, 1e-12));

const Re = computed(() =>
  reynoldsNumber(rho.value, velocity.value, diameterM.value, mu.value),
);

const deltaPa = computed(() =>
  pressureDropHagenPoiseuille(
    Qm3s.value,
    mu.value,
    lengthM.value,
    diameterM.value,
  ),
);

/** Horizontal “markers” drift faster when Q is higher; duration clamped for very slow flows. */
const crossSectionFlowDurationSec = computed(() => {
  const q = flowLs.value;
  if (q < 1e-6) return 999;
  const refQ = 80;
  return Math.min(28, Math.max(0.45, refQ / q));
});

/** Cascade: pipe fills 1 L bottle; each full bottle dumps into middle tank; full middle dumps into largest. */
const CASCADE_BOTTLE_L = 1;
const CASCADE_MID_TANK_L = 80;
const CASCADE_LARGE_TANK_L = 2000;

type CascadeVolumes = {
  bottleL: number;
  fishL: number;
  dunkL: number;
};

type CascadePulse = {
  bottleUntil: number;
  fishUntil: number;
  dunkUntil: number;
};

function advanceCascade(
  prev: CascadeVolumes,
  qLs: number,
  dt: number,
  nowMs: number,
): { next: CascadeVolumes; pulse: CascadePulse } {
  const pulse: CascadePulse = { bottleUntil: 0, fishUntil: 0, dunkUntil: 0 };
  const flashUntil = nowMs + 200;

  if (qLs < 1e-9) {
    return {
      next: { bottleL: 0, fishL: 0, dunkL: 0 },
      pulse,
    };
  }

  let { bottleL, fishL, dunkL } = prev;
  bottleL += qLs * dt;

  let guard = 0;
  while (guard++ < 100_000) {
    if (dunkL >= CASCADE_LARGE_TANK_L - 1e-9) {
      dunkL -= CASCADE_LARGE_TANK_L;
      pulse.dunkUntil = Math.max(pulse.dunkUntil, flashUntil);
      continue;
    }
    if (fishL >= CASCADE_MID_TANK_L - 1e-9) {
      fishL -= CASCADE_MID_TANK_L;
      dunkL += CASCADE_MID_TANK_L;
      pulse.fishUntil = Math.max(pulse.fishUntil, flashUntil);
      pulse.dunkUntil = Math.max(pulse.dunkUntil, flashUntil);
      continue;
    }
    if (bottleL >= CASCADE_BOTTLE_L - 1e-9) {
      bottleL -= CASCADE_BOTTLE_L;
      fishL += CASCADE_BOTTLE_L;
      pulse.bottleUntil = Math.max(pulse.bottleUntil, flashUntil);
      pulse.fishUntil = Math.max(pulse.fishUntil, flashUntil);
      continue;
    }
    break;
  }

  return { next: { bottleL, fishL, dunkL }, pulse };
}

const cascadeVol = shallowRef<CascadeVolumes>({
  bottleL: 0,
  fishL: 0,
  dunkL: 0,
});
const pulseUntil = shallowRef<CascadePulse>({
  bottleUntil: 0,
  fishUntil: 0,
  dunkUntil: 0,
});
const lastNowMs = shallowRef(0);

let rafId = 0;
let lastPerfMs = 0;

onMounted(() => {
  lastPerfMs = performance.now();
  const tick = (now: number) => {
    lastNowMs.value = now;
    const dt = Math.min(0.2, Math.max(0, (now - lastPerfMs) / 1000));
    lastPerfMs = now;

    const q = flowLs.value;
    if (q < 1e-9) {
      cascadeVol.value = { bottleL: 0, fishL: 0, dunkL: 0 };
      pulseUntil.value = { bottleUntil: 0, fishUntil: 0, dunkUntil: 0 };
    } else {
      const { next, pulse } = advanceCascade(cascadeVol.value, q, dt, now);
      cascadeVol.value = next;
      if (pulse.bottleUntil > 0 || pulse.fishUntil > 0 || pulse.dunkUntil > 0) {
        pulseUntil.value = {
          bottleUntil: Math.max(
            pulseUntil.value.bottleUntil,
            pulse.bottleUntil,
          ),
          fishUntil: Math.max(pulseUntil.value.fishUntil, pulse.fishUntil),
          dunkUntil: Math.max(pulseUntil.value.dunkUntil, pulse.dunkUntil),
        };
      }
    }

    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
});

function fillFrac(current: number, cap: number) {
  if (cap < 1e-12) return 0;
  return clamp(current / cap, 0, 1);
}

/** Side-view pipe length in SVG units (maps teaching L to a readable bar). */
const pipeSideViewWidth = computed(() => {
  const L = lengthM.value;
  return 72 + ((L - 5) / (80 - 5)) * (168 - 72);
});

const PIPE_DEMO_X0 = 12;

const streamTipX = computed(() => PIPE_DEMO_X0 + pipeSideViewWidth.value + 5);

/** Outlet centerline: funnel + bottle align on this x. */
const bottleStreamCx = computed(() => streamTipX.value);

const sideStreamDurationSec = computed(() =>
  Math.max(0.35, crossSectionFlowDurationSec.value * 0.75),
);

const BOTTLE_WATER_TOP_Y = 39;

/** Bottle outline: funnel under pipe mouth, then neck and body (symmetric about sx). */
function bottleWithFunnelD(sx: number): string {
  return [
    `M ${sx - 7} 102`,
    `L ${sx - 7} 68`,
    `L ${sx - 4} 68`,
    `L ${sx - 4} 56`,
    `L ${sx - 2.5} 56`,
    `L ${sx - 2.5} 50`,
    `L ${sx - 9} 45`,
    `L ${sx - 11} ${BOTTLE_WATER_TOP_Y}`,
    `L ${sx + 11} ${BOTTLE_WATER_TOP_Y}`,
    `L ${sx + 9} 45`,
    `L ${sx + 2.5} 50`,
    `L ${sx + 2.5} 56`,
    `L ${sx + 4} 56`,
    `L ${sx + 4} 68`,
    `L ${sx + 7} 68`,
    `L ${sx + 7} 102`,
    "Z",
  ].join(" ");
}

type TankFront = { x: number; y: number; w: number; h: number };

/** Simple “cabinet” perspective: top + right skew (dx right, dy up). */
function tankBoxPaths(front: TankFront, dx: number, dy: number) {
  const { x, y, w, h } = front;
  const topD = `M ${x} ${y} L ${x + dx} ${y - dy} L ${x + w + dx} ${y - dy} L ${x + w} ${y} Z`;
  const rightD = `M ${x + w} ${y} L ${x + w + dx} ${y - dy} L ${x + w + dx} ${y + h - dy} L ${x + w} ${y + h} Z`;
  const frontD = `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
  return { topD, rightD, frontD, fx: x, fy: y, fw: w, fh: h, dx, dy };
}

function fillWaterRect(
  cx: number,
  innerTop: number,
  innerBottom: number,
  halfW: number,
  fill01: number,
) {
  const h = innerBottom - innerTop;
  const fillH = Math.max(0, fill01 * h);
  const y = innerBottom - fillH;
  return { x: cx - halfW, y, w: halfW * 2, height: fillH };
}

const fillDemoViewBoxW = computed(() => {
  const sx = streamTipX.value;
  const fish = tankBoxPaths({ x: sx + 26, y: 70, w: 38, h: 32 }, 15, 10);
  const dunk = tankBoxPaths(
    { x: fish.fx + fish.fw + fish.dx + 18, y: 56, w: 52, h: 46 },
    24,
    15,
  );
  return Math.max(360, Math.ceil(dunk.fx + dunk.fw + dunk.dx + 28));
});

type TankBoxGeom = ReturnType<typeof tankBoxPaths>;

type CascadeVesselKey = "bottle" | "fish" | "dunk";

type CascadeVesselView = {
  key: CascadeVesselKey;
  cx: number;
  clipId: string;
  kind: "bottle" | "tank";
  outlineD?: string;
  box?: TankBoxGeom;
  fillRect: { x: number; y: number; w: number; height: number };
  volumeLabel: string;
};

const cascadeVessels = computed((): CascadeVesselView[] => {
  const sx = streamTipX.value;
  const v = cascadeVol.value;

  const fishBox = tankBoxPaths({ x: sx + 26, y: 70, w: 38, h: 32 }, 15, 10);
  const dunkBox = tankBoxPaths(
    {
      x: fishBox.fx + fishBox.fw + fishBox.dx + 18,
      y: 56,
      w: 52,
      h: 46,
    },
    24,
    15,
  );

  const volLabel = (liters: number) =>
    `${liters.toLocaleString(undefined, { maximumFractionDigits: 0 })} L`;

  const fishCxMid = fishBox.fx + fishBox.fw / 2;
  const dunkCxMid = dunkBox.fx + dunkBox.fw / 2;

  return [
    {
      key: "bottle",
      cx: sx,
      clipId: "pl-casc-bottle",
      kind: "bottle",
      outlineD: bottleWithFunnelD(sx),
      fillRect: fillWaterRect(
        sx,
        BOTTLE_WATER_TOP_Y,
        102,
        12,
        fillFrac(v.bottleL, CASCADE_BOTTLE_L),
      ),
      volumeLabel: volLabel(CASCADE_BOTTLE_L),
    },
    {
      key: "fish",
      cx: fishCxMid,
      clipId: "pl-casc-fish",
      kind: "tank",
      box: fishBox,
      fillRect: fillWaterRect(
        fishCxMid,
        fishBox.fy,
        fishBox.fy + fishBox.fh,
        fishBox.fw / 2,
        fillFrac(v.fishL, CASCADE_MID_TANK_L),
      ),
      volumeLabel: volLabel(CASCADE_MID_TANK_L),
    },
    {
      key: "dunk",
      cx: dunkCxMid,
      clipId: "pl-casc-dunk",
      kind: "tank",
      box: dunkBox,
      fillRect: fillWaterRect(
        dunkCxMid,
        dunkBox.fy,
        dunkBox.fy + dunkBox.fh,
        dunkBox.fw / 2,
        fillFrac(v.dunkL, CASCADE_LARGE_TANK_L),
      ),
      volumeLabel: volLabel(CASCADE_LARGE_TANK_L),
    },
  ];
});

function vesselPulsing(key: CascadeVesselKey): boolean {
  const n = lastNowMs.value;
  const p = pulseUntil.value;
  if (key === "bottle") return n < p.bottleUntil;
  if (key === "fish") return n < p.fishUntil;
  return n < p.dunkUntil;
}
</script>

<template>
  <div class="space-y-6">
    <figure
      class="rounded-xl border border-gray-200 bg-linear-to-b from-sky-50/80 to-white p-4 dark:border-gray-800 dark:from-sky-950/40 dark:to-gray-950"
      :style="flowGradientVars">
      <svg
        viewBox="0 0 220 100"
        class="mx-auto block h-auto w-full max-w-md text-gray-800 dark:text-gray-100"
        role="img"
        aria-label="Cross-section of a round pipe. Lighter colors indicate faster flow; in laminar flow the layers are concentric circles.">
        <defs>
          <clipPath id="pipeLamDiskClip">
            <circle cx="110" cy="52" r="43.35" />
          </clipPath>
        </defs>
        <circle
          cx="110"
          cy="52"
          r="44"
          fill="currentColor"
          fill-opacity="0.04"
          stroke="none" />
        <g clip-path="url(#pipeLamDiskClip)">
          <circle
            v-for="layer in crossSectionLayers"
            :key="layer.r"
            cx="110"
            cy="52"
            :r="layer.r"
            :fill="layer.fill" />
        </g>
        <circle
          cx="110"
          cy="52"
          r="44"
          fill="none"
          stroke="currentColor"
          stroke-opacity="0.4"
          stroke-width="1.5" />
      </svg>
      <figcaption
        class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <p class="font-medium text-gray-800 dark:text-gray-200">
          Cross-section of a round pipe
        </p>
        <p>
          Lighter colors represent where the flow is faster. The “layers” of
          laminar flow in a round pipe are circular.
        </p>
      </figcaption>
    </figure>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="space-y-2 md:col-span-2 mt-4">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Pipe inner diameter D</span
        >
        <select
          v-model="diameterPresetId"
          class="w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
          <option v-for="p in DIAMETER_PRESETS" :key="p.id" :value="p.id">
            {{ p.mm }} mm — {{ p.label }}
          </option>
        </select>
        <div class="text-[11px] leading-snug text-gray-500 dark:text-gray-400">
          Choose among typical water pipe sizes.
        </div>
      </label>

      <label class="space-y-2 md:col-span-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Pipe length L</span
        >
        <select
          v-model.number="lengthM"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
          <option
            v-for="row in PIPE_LENGTH_OPTIONS"
            :key="row.m"
            :value="row.m">
            {{ row.m }} m — {{ row.note }}
          </option>
        </select>
      </label>

      <label class="space-y-2 md:col-span-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Volume flow Q (liters/second)</span
        >
        <div class="flex flex-col gap-0">
          <div class="relative">
            <input
              v-model.number="flowSlider"
              type="range"
              min="0"
              :max="Q_SLIDER_STEPS"
              step="1"
              class="relative z-0 w-full" >
            <div
              class="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-10 -translate-y-1/2"
              aria-hidden="true">
              <div
                class="absolute bottom-1 top-1 w-0.5 -translate-x-1/2 bg-orange-500 dark:bg-orange-400"
                :style="{ left: `${Q_SLIDER_LAMINAR_FRACTION * 100}%` }" />
            </div>
          </div>
          <div class="relative -mt-3.5 flex min-h-5 items-center">
            <p class="text-sm tabular-nums text-gray-700 dark:text-gray-300">
              {{ flowLs < 0.1 ? flowLs.toFixed(3) : flowLs.toFixed(2) }} L/s
            </p>
            <span
              class="pointer-events-none absolute top-1/3 -translate-y-1/2 text-xs font-medium whitespace-nowrap text-orange-600 dark:text-orange-400"
              :style="{
                left: `calc(${Q_SLIDER_LAMINAR_FRACTION * 100}% + 6px)`,
              }"
              >turbulence zone</span
            >
          </div>
        </div>
      </label>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
      <div
        class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div
          class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Reynolds Number
        </div>
        <div
          class="mt-2 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ Re.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
        </div>
      </div>
      <div
        class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div
          class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Pressure drop (Δp)
        </div>
        <div
          class="mt-2 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {{ formatPressureDropPa(deltaPa) }}
        </div>
      </div>
    </div>

    <figure
      class="rounded-xl border border-gray-200 bg-linear-to-b from-sky-50/80 to-white p-4 dark:border-gray-800 dark:from-sky-950/40 dark:to-gray-950"
      :style="flowGradientVars">
      <svg
        :viewBox="'0 0 ' + fillDemoViewBoxW + ' 132'"
        class="mx-auto block h-auto w-full max-w-lg text-gray-800 dark:text-gray-100"
        role="img"
        aria-label="Pipe outlet over a funnel and bottle; water then flows through two perspective tanks at volume flow Q.">
        <defs>
          <clipPath
            v-for="ves in cascadeVessels"
            :id="ves.clipId"
            :key="'clip-' + ves.key">
            <path
              v-if="ves.kind === 'bottle' && ves.outlineD"
              :d="ves.outlineD" />
            <rect
              v-else-if="ves.kind === 'tank' && ves.box"
              :x="ves.box.fx"
              :y="ves.box.fy"
              :width="ves.box.fw"
              :height="ves.box.fh" />
          </clipPath>
        </defs>

        <text
          :x="PIPE_DEMO_X0 + pipeSideViewWidth * 0.48"
          y="22"
          text-anchor="middle"
          class="fill-gray-600 text-[8px] dark:fill-gray-400">
          {{ lengthM }} m
        </text>

        <rect
          :x="PIPE_DEMO_X0"
          y="30"
          :width="pipeSideViewWidth"
          height="20"
          rx="5"
          fill="currentColor"
          fill-opacity="0.06"
          stroke="currentColor"
          stroke-opacity="0.38"
          stroke-width="1.2" />
        <rect
          :x="PIPE_DEMO_X0 + 2.5"
          y="33"
          :width="Math.max(4, pipeSideViewWidth - 5)"
          height="14"
          rx="3"
          fill="var(--flow-center)"
          fill-opacity="0.28" />
        <rect
          :x="PIPE_DEMO_X0 + pipeSideViewWidth - 2"
          y="35"
          width="14"
          height="10"
          rx="2"
          fill="currentColor"
          fill-opacity="0.06"
          stroke="currentColor"
          stroke-opacity="0.35"
          stroke-width="1" />

        <g
          v-if="flowLs >= 1e-6"
          class="pipe-lam-stream-root"
          :transform="`translate(${bottleStreamCx}, 40)`"
          :style="{ '--drop-dur': `${sideStreamDurationSec}s` }">
          <circle
            cx="0"
            cy="0"
            r="2.2"
            class="pipe-lam-drop"
            fill="var(--flow-center)"
            fill-opacity="0.78" />
          <circle
            cx="0"
            cy="0"
            r="2.1"
            class="pipe-lam-drop pipe-lam-drop--2"
            fill="var(--flow-center)"
            fill-opacity="0.62" />
          <circle
            cx="0"
            cy="0"
            r="1.9"
            class="pipe-lam-drop pipe-lam-drop--3"
            fill="var(--flow-center)"
            fill-opacity="0.52" />
        </g>

        <g v-for="ves in cascadeVessels" :key="ves.key">
          <g :class="{ 'pipe-lam-vessel-flash': vesselPulsing(ves.key) }">
            <template v-if="ves.kind === 'tank' && ves.box">
              <path
                :d="ves.box.rightD"
                fill="currentColor"
                fill-opacity="0.14"
                stroke="none" />
              <path
                :d="ves.box.topD"
                fill="currentColor"
                fill-opacity="0.09"
                stroke="none" />
            </template>
            <g :clip-path="'url(#' + ves.clipId + ')'">
              <rect
                :x="ves.fillRect.x"
                :y="ves.fillRect.y"
                :width="ves.fillRect.w"
                :height="Math.max(0, ves.fillRect.height)"
                fill="var(--flow-center)"
                fill-opacity="0.52" />
            </g>
            <path
              v-if="ves.kind === 'bottle' && ves.outlineD"
              :d="ves.outlineD"
              fill="none"
              stroke="currentColor"
              stroke-opacity="0.45"
              stroke-width="1.25" />
            <template v-if="ves.kind === 'tank' && ves.box">
              <path
                :d="ves.box.frontD"
                fill="none"
                stroke="currentColor"
                stroke-opacity="0.5"
                stroke-width="1.25" />
              <path
                :d="ves.box.topD"
                fill="none"
                stroke="currentColor"
                stroke-opacity="0.32"
                stroke-width="1" />
              <path
                :d="ves.box.rightD"
                fill="none"
                stroke="currentColor"
                stroke-opacity="0.32"
                stroke-width="1" />
            </template>
          </g>
          <text
            :x="ves.cx"
            y="122"
            text-anchor="middle"
            class="fill-gray-700 text-[8px] tabular-nums dark:fill-gray-300">
            {{ ves.volumeLabel }}
          </text>
        </g>
      </svg>
      <figcaption
        class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <p class="font-medium text-gray-800 dark:text-gray-200">
          A flowing pipe, a bottle, a fish tank and a dunk tank
        </p>
        <p>
          The pipe drains into a funnel that fills a 1 liter bottle. When the
          bottle fills, it "drains" into the fish tank next to it. When the fish
          tank fills, it drains into the dunk tank. Make changes, and see how
          long it takes to fill these vessels.
        </p>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
@keyframes pipe-lam-drip-kf {
  0% {
    transform: translateY(0);
    opacity: 0.92;
  }

  80% {
    opacity: 0.42;
  }

  100% {
    transform: translateY(32px);
    opacity: 0;
  }
}

.pipe-lam-stream-root .pipe-lam-drop {
  animation: pipe-lam-drip-kf var(--drop-dur, 1.2s) linear infinite;
}

.pipe-lam-stream-root .pipe-lam-drop--2 {
  animation-delay: calc(var(--drop-dur, 1.2s) * -0.36);
}

.pipe-lam-stream-root .pipe-lam-drop--3 {
  animation-delay: calc(var(--drop-dur, 1.2s) * -0.72);
}

.pipe-lam-vessel-flash {
  filter: brightness(1.38) saturate(1.12);
}
</style>
