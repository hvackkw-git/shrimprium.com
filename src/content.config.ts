import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const devlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/devlog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    author: z.string().optional(),
    series: z.string().optional(),
  }),
});

// Lab: 아직 개발 중인 아이디어. 정사각형 그림 한 장과 짧은 글.
const lab = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lab' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: image(),
    imageAlt: z.string().optional(),
  }),
});

// Shrimpedia: 새우 잡학 사전. Lab과 같은 형식(정사각형 그림 한 장과 짧은 글).
const shrimpedia = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/shrimpedia' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    image: image(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = { devlog, lab, shrimpedia };
