import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        type: z.enum(['blog', 'isotope', 'lesson', 'simulator']).optional(),
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
        component: z.string().optional(),
        element: z.string().optional(),
        symbol: z.string().optional(),
        atomicNumber: z.number().optional(),
        massNumber: z.number().optional(),
        neutrons: z.number().optional(),
        stability: z.enum(['stable', 'radioactive']).optional(),
        halfLife: z.string().optional(),
        decayMode: z.string().optional(),
        abundance: z.string().optional(),
        applications: z.array(z.string()).optional()
      })
    })
  }
})

