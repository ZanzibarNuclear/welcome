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

All markdown lives under `content/` and is registered as a single `content` collection in `content.config.ts`. Content is queried with `queryCollection('content').path('/section/slug')`. The `type` frontmatter field distinguishes collection intent (blog, lesson, simulator).

```
content/
├── blog/          # type: blog
├── lessons/       # type: lesson
├── simulators/    # type: simulator
└── pages/         # static pages (about, contact, privacy, terms)
```

### Simulator Pattern

Simulators are the most complex content type. Each simulator has:
1. A markdown file in `content/simulators/` with a `component: "ComponentName"` frontmatter field
2. A Vue component in `app/components/simulators/ComponentName.vue`

The detail page (`app/pages/simulators/[slug].vue`) dynamically imports the component by name using `defineAsyncComponent`. If no component exists, a "coming soon" placeholder renders instead.

### Layout System

`app/layouts/default.vue` conditionally shows a left sidebar based on the route — sidebar appears only on detail pages (paths like `/blog/slug`, `/lessons/slug`, `/simulators/slug`), not on list/index pages. `app/layouts/no-sidebar.vue` is an alternative without the sidebar.

### Styling

Custom prose styles for markdown content are in `assets/css/main.css` (not a Tailwind plugin — plain CSS using `theme()` calls). The primary color palette is defined via Tailwind v4's `@theme` block using OKLCH values. The app is light-mode only (`colorMode.preference: 'light'`).

## Adding New Content

**New simulator:** create `content/simulators/slug.md` (with `component: "MyComponent"` in frontmatter) + `app/components/simulators/MyComponent.vue`.

**New blog post or lesson:** create the markdown file in the appropriate `content/` subdirectory with the correct frontmatter — the route is automatic.

See `CONTENT-STRUCTURE.md` for full frontmatter schemas for each content type.
