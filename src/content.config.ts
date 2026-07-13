import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

const jobs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/jobs' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    start: z.string(), // "2023-01" — render as needed
    end: z.string(), // or "present"
    tags: z.array(z.string()).default([]),
    order: z.number(), // manual sort
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    venue: z.string(),
    year: z.number(),
    doi: z.string().optional(),
    authors: z.string(),
    note: z.string().optional(), // e.g. an award attached to the paper
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    category: z.string(), // "MIR / AUDIO ML", "META", ...
    stack: z.array(z.string()),
    repo: z.string().optional(),
    demo: z.string().optional(),
    featured: z.boolean(), // featured → dark hero treatment on /projects
  }),
});

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recipes' }),
  schema: z.object({
    title: z.string(),
    category: z.string(), // "COOKIES", "PASTA", ...
    baseServings: z.number(),
    servingUnit: z.string(), // "cookies", "servings"
    ingredients: z.array(
      z.object({ amount: z.number(), unit: z.string(), item: z.string() }),
    ),
  }),
});

const lists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lists' }),
  // Body is a plain Markdown checklist: `- [x]` consumed, `- [ ]` queued,
  // trailing `*` = favorite (rendered as a mauve star by rehypeFavStars).
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/education' }),
  schema: z.object({
    institution: z.string(),
    credential: z.string(),
    start: z.string(),
    end: z.string(), // or "present"
    order: z.number(), // manual sort
  }),
});

const art = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/art' }),
  // image is optional until real scans land in src/assets/art — make it
  // required once the gallery has real pieces.
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      medium: z.enum(['ink', 'watercolor', 'acrylic', 'oil']),
      year: z.number().optional(),
      image: image().optional(),
    }),
});

export const collections = { jobs, publications, projects, recipes, education, art, lists };
