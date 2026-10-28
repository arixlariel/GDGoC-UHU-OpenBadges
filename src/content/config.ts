import { defineCollection, z } from 'astro:content';

const styleEnum = z.enum(['classic', 'hackathon', 'cyber', 'candy', 'summer', 'winter']);

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
    style: styleEnum.default('classic'),
    issuerId: z.string().default('gdgoc-uhu'),
  }),
});

const assertionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    recipient: z.object({
      name: z.string(),
      email: z.string().optional(),
      identity: z.string(),
      hashed: z.boolean().default(true),
      type: z.literal('email').default('email'),
      salt: z.string().optional(),
    }),
    badgeId: z.string(),
    role: z.string().default('Participante'),
    issuedOn: z.string(),
    expires: z.string().optional(),
    evidence: z.string().optional(),
    styleOverride: styleEnum.optional(),
  }),
});

export const collections = {
  badges: badgesCollection,
  assertions: assertionsCollection,
};
