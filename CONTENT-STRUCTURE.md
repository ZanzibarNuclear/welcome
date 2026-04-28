# Atomic Ambitions Website

A Nuxt 4 + Nuxt Content site for exploring atomic physics through articles, lessons, reactor guides, and interactive simulators.

## Content Structure

The site is organized into five main content collections:

### 1. **Blog** (`/blog`)
Articles and thought pieces about atomic physics and particle science.

**Content Location:** `content/blog/`
**Frontmatter:**
```yaml
type: blog
title: "Article Title"
date: 2026-01-08
author: "Author Name"
tags: [tag1, tag2]
excerpt: "Brief description"
featured: true/false
```

**Routes:**
- `/blog` - List of all blog posts
- `/blog/[slug]` - Individual blog post

### 2. **Lessons** (`/lessons`)
Structured learning paths with instructional content and quizzes.

**Content Location:** `content/lessons/`
**Frontmatter:**
```yaml
type: lesson
title: "Lesson Title"
difficulty: beginner|intermediate|advanced
duration: 20  # minutes
order: 1
series: "Series Name"
quiz: true/false
description: "Brief description"
```

**Routes:**
- `/lessons` - Catalog of all lessons grouped by series
- `/lessons/[slug]` - Individual lesson page

### 3. **Simulators** (`/simulators`)
Interactive experiments and visualizations for hands-on learning.

**Content Location:** `content/simulators/`
**Frontmatter:**
```yaml
type: simulator
title: "Simulator Title"
component: "ComponentName"  # Optional: Vue component in app/components/simulators/
externalUrl: "https://example.com"  # Optional: external simulator URL
externalLabel: "Launch Simulator"  # Optional: CTA label for external simulators
difficulty: beginner|intermediate|advanced
description: "Brief description"
tags: [tag1, tag2]
featured: true/false
```

**Routes:**
- `/simulators` - Gallery of all simulators grouped by difficulty
- `/simulators/[slug]` - Individual simulator guide page with optional embedded component or external launch link

**Simulator Components:** Located in `app/components/simulators/`
- Simulators may reference a Vue component that renders an embedded interactive experience
- External simulators can omit `component` and use `externalUrl` instead
- Example: `AtomBuilder.vue` for the "Build an Atom" simulator

### 4. **Reactors** (`/reactors`)
Guides to different nuclear reactor designs and concepts.

**Content Location:** `content/reactors/`
**Frontmatter:**
```yaml
type: reactor
title: "Reactor Type"
description: "Brief description"
generation: "Generation II / III"
coolant: "Light water"
moderator: "Light water"
fuel: "Enriched uranium dioxide"
status: "Widely deployed"
tags: [light-water, power-reactor]
order: 1
```

**Routes:**
- `/reactors` - Catalog of reactor types
- `/reactors/[slug]` - Individual reactor guide

### 5. **Corporate Pages** (`/about`, `/contact`, `/policies`)
Static informational pages.

**Content Location:** `content/pages/`
**Routes:**
- `/about` - About page
- `/contact` - Contact information
- `/policies` - Terms of use and privacy policy

## Site Structure

```
content/
├── pages/          # Corporate/static pages
├── blog/           # Blog articles
├── lessons/        # Instructional lessons
├── reactors/       # Reactor guides
└── simulators/     # Interactive simulators

app/
├── pages/
│   ├── index.vue                    # Home page with featured content
│   ├── blog/
│   │   ├── index.vue               # Blog list
│   │   └── [slug].vue              # Blog post detail
│   ├── lessons/
│   │   ├── index.vue               # Lessons catalog
│   │   └── [slug].vue              # Lesson detail
│   ├── simulators/
│   │   ├── index.vue               # Simulators gallery
│   │   └── [slug].vue              # Simulator detail
│   └── about.vue, contact.vue, etc. # Corporate pages
├── components/
│   ├── simulators/                  # Interactive simulator components
│   │   └── AtomBuilder.vue
│   ├── Header.vue
│   ├── Navigation.vue
│   └── Footer.vue
└── layouts/
    ├── default.vue                  # Main layout with conditional sidebar
    └── no-sidebar.vue               # Alternative layout
```

## Navigation

### Header (Top Navigation)
- Home
- Blog
- Lessons
- Simulators
- About

### Sidebar (Contextual)
Shows on detail pages (blog posts, lessons, simulators) for quick navigation within the section.

### Footer
- Contact
- Privacy Policy
- Terms of Use

## Adding New Content

### New Blog Post
1. Create `content/blog/your-slug.md`
2. Add frontmatter with required fields
3. Write content in markdown
4. Post automatically appears at `/blog/your-slug`

### New Lesson
1. Create `content/lessons/your-slug.md`
2. Add frontmatter with lesson metadata
3. Include quiz questions in markdown
4. Lesson appears at `/lessons/your-slug`

### New Simulator
1. Create `content/simulators/your-slug.md` with instructions
2. Create `app/components/simulators/YourComponent.vue`
3. Reference component name in frontmatter
4. Simulator appears at `/simulators/your-slug`

## Styling

- **Typography:** Custom prose styles in `assets/css/main.css`
- **Framework:** Tailwind CSS v4 with Nuxt UI components
- **Theme:** Light/dark mode with smooth transitions
- **Colors:** Primary color palette defined in CSS using OKLCH

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **Nuxt 4** - Vue.js framework
- **Nuxt Content** - File-based CMS
- **Nuxt UI** - Component library
- **Tailwind CSS v4** - Styling
- **TypeScript** - Type safety
