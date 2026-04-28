# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Build for production
npm run generate   # Static site generation
npm run preview    # Preview production build
npx nuxt typecheck # Type checking
npx eslint .       # Lint
```

There is no test suite.

## Architecture

**Atomic Ambitions** is a Nuxt 4 educational site about atomic physics. Stack: Nuxt 4, `@nuxt/content` v3, `@nuxt/ui` v4, Tailwind CSS v4, TypeScript.

### Content System

All markdown lives under `content/` and is registered as a single `content` collection in `content.config.ts`. Content is queried with `queryCollection('content').path('/section/slug')`. The `type` frontmatter field distinguishes collection intent (blog, lesson, reactor, simulator).

```
content/
├── blog/          # type: blog
├── lessons/       # type: lesson
├── reactors/      # type: reactor
├── simulators/    # type: simulator
└── pages/         # static pages (about, contact, policies)
```

### Simulator Pattern

Simulators are the most complex content type. Each simulator has a markdown file in `content/simulators/`. Embedded simulators also use a `component: "ComponentName"` frontmatter field and a Vue component in `app/components/simulators/ComponentName.vue`. External simulators can omit `component` and use `externalUrl`/`externalLabel` frontmatter instead.

The detail page (`app/pages/simulators/[slug].vue`) dynamically imports embedded components by name using `defineAsyncComponent`, and renders external launch links when `externalUrl` is set.

### Layout System

`app/layouts/default.vue` conditionally shows a left sidebar based on the route — sidebar appears only on detail pages (paths like `/blog/slug`, `/lessons/slug`, `/simulators/slug`), not on list/index pages. `app/layouts/no-sidebar.vue` is an alternative without the sidebar.

### Styling

Custom prose styles for markdown content are in `assets/css/main.css` (not a Tailwind plugin — plain CSS using `theme()` calls). The primary color palette is defined via Tailwind v4's `@theme` block using OKLCH values. Color mode is configured through Nuxt UI/Nuxt Color Mode; do not assume the app is light-mode only.

## Adding New Content

**New embedded simulator:** create `content/simulators/slug.md` (with `component: "MyComponent"` in frontmatter) + `app/components/simulators/MyComponent.vue`.

**New external simulator guide:** create `content/simulators/slug.md` with `externalUrl` and optional `externalLabel` frontmatter.

**New blog post or lesson:** create the markdown file in the appropriate `content/` subdirectory with the correct frontmatter — the route is automatic.

See `CONTENT-STRUCTURE.md` for full frontmatter schemas for each content type.
