import { z } from 'zod';
import { insertSeedSchema, insertRatingSchema, seeds, ratings } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  seeds: {
    list: {
      method: 'GET' as const,
      path: '/api/seeds',
      responses: {
        200: z.array(z.custom<any>()), // Using any temporarily for composed types, or refine
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/seeds/:id',
      responses: {
        200: z.custom<any>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/seeds',
      input: insertSeedSchema,
      responses: {
        201: z.custom<typeof seeds.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  ratings: {
    list: {
      method: 'GET' as const,
      path: '/api/seeds/:seedId/ratings',
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/seeds/:seedId/ratings',
      input: insertRatingSchema,
      responses: {
        201: z.custom<typeof ratings.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
