import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        type: z.enum(['blog', 'lesson', 'reactor', 'simulator']).optional(),
        title: z.string(),
        description: z.string().optional(),
        date: z.string().optional(),
        author: z.string().optional(),
        tags: z.array(z.string()).optional(),
        excerpt: z.string().optional(),
        featured: z.boolean().optional(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        duration: z.number().optional(),
        order: z.number().optional(),
        series: z.string().optional(),
        quiz: z.boolean().optional(),
        generation: z.string().optional(),
        coolant: z.string().optional(),
        moderator: z.string().optional(),
        fuel: z.string().optional(),
        status: z.string().optional(),
        component: z.string().optional()
      })
    })
  }
})

