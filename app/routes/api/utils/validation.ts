import type { LoaderArgs } from '@remix-run/node';
import { z } from 'zod';
import { zx } from 'zodix';
import type { TypeToZod } from '~/utils/types';
import type { components } from '../types';
import { throwNotFound } from './data';

type UpdateJokeParams = components['schemas']['UpdateJoke'];

const bodySchema = z
  .object<TypeToZod<UpdateJokeParams>>({
    title: z.string().min(3, {
      message: 'Title must be at least 3 characters'
    }),
    imageUrl: z.string().optional(),
    content: z
      .string()
      .min(10, {
        message: 'Content must be at least 10 characters'
      })
      .max(100, {
        message: 'Content must be at most 100 characters'
      })
  })
  .transform(({ imageUrl, ...rest }) => ({
    ...rest,
    imageUrl: (imageUrl as string) ?? undefined
  }));

export const validRequestBody = (body: unknown) => {
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  return { success: true, data: parsed.data };
};

export const validateParams = (params: LoaderArgs['params']) => {
  const paramsSchema = z.object({
    id: z.string()
  });
  const parsed = zx.parseParamsSafe(params, paramsSchema);

  if (!parsed.success) {
    return throwNotFound(params.id);
  }

  return parsed.data.id;
};
