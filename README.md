# Atomic Ambitions

Atomic Ambitions is an educational website for learning how the atomic world works, from the structure of matter to the technologies built around nuclear energy. The website combines approachable articles, guided lessons, reactor explainers, and interactive simulators so readers can move from curiosity to hands-on understanding.

The site is built for people who want clear, visual explanations of atomic physics without needing to start from a textbook. Blog posts explore big questions and current ideas, lessons organize core concepts into learning paths, reactor guides compare real nuclear designs, and simulators let visitors experiment with ideas directly in the browser.

## What Is Inside

- **Blog**: Essays and explainers about atoms, radiation, nuclear energy, and the role of atomic science in the real world.
- **Lessons**: Structured learning content with difficulty, duration, ordering, and optional quizzes.
- **Reactors**: Reference guides for nuclear reactor types, including coolant, moderator, fuel, generation, and deployment status.
- **Simulators**: Interactive Vue components paired with markdown content, used for experiments and visual demonstrations.
- **The Usual Suspects**: About, contact, privacy, and terms pages.

All content lives in `content/` and is powered by Nuxt Content. Markdown frontmatter describes each entry, while the Vue app handles routing, layout, navigation, styling, and interactive components.

## Tech Stack

- **Nuxt 4** and **Vue 3** for the application framework
- **Nuxt Content** for markdown-driven content
- **Nuxt UI** and **Tailwind CSS v4** for interface components and styling
- **TypeScript** for safer application code

## Project Structure

```text
app/
├── components/        # Shared UI and simulator components
├── layouts/           # Site layouts, including contextual sidebars
└── pages/             # Route pages for sections and detail views

content/
├── blog/              # Blog posts
├── lessons/           # Learning modules
├── pages/             # Static pages
├── reactors/          # Reactor guides
└── simulators/        # Simulator descriptions and metadata
```

Simulator content follows a two-part pattern: a markdown file in `content/simulators/` describes the experience, and a matching Vue component in `app/components/simulators/` renders the interactive portion.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:3000`.

Build for production:

```bash
npm run build
```

Generate a static version of the site:

```bash
npm run generate
```

Preview a production build:

```bash
npm run preview
```

## Adding Content

Add new articles, lessons, reactor guides, and simulator pages by creating markdown files under the appropriate `content/` directory. Use the existing files as examples for frontmatter fields such as `title`, `description`, `type`, `tags`, `difficulty`, and `order`.

For full content schemas and examples, see `CONTENT-STRUCTURE.md`.
