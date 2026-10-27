import { defineCollection, z } from 'astro:content';

const badgesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    image: z.string(),
    criteria: z.object({
      narrative: z.string(),
    }),
    tags: z.array(z.string()).default([]),
    style: z.enum(['classic', 'hackathon']).default('classic'),
    issuerId: z.string().default('gdgoc-uhu'),
  }),
});

const assertionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    recipient: z.object({
      name: z.string(), // Nombre público visible en la web
      email: z.string().optional(), // Email real (se usará para generar hash)
      identity: z.string(), // Hash SHA-256 (ej: sha256$...)
      hashed: z.boolean().default(true),
      type: z.literal('email').default('email'),
      salt: z.string().optional(),
    }),
    badgeId: z.string(),
    role: z.string().default('Participante'),
    issuedOn: z.string(),
    expires: z.string().optional(),
    evidence: z.string().optional(),
    styleOverride: z.enum(['classic', 'hackathon']).optional(),
  }),
});

export const collections = {
  badges: badgesCollection,
  assertions: assertionsCollection,
};

