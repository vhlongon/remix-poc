import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { z } from 'zod';
import { zx } from 'zodix';
import type { TypeToZod } from '~/utils/types';
import type { components } from '../types';
import { throwNotFound } from './data';

type UpdateJokeParams = components['schemas']['UpdateJoke'];

export const validateQuery = (request: LoaderArgs['request']) => {
  const bodySchema = z
    .object<TypeToZod<UpdateJokeParams>>({
      title: z.string().min(3),
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

  const parsed = zx.parseQuerySafe(request, bodySchema);

  if (!parsed.success) {
    throw json({ message: 'Invalid body', errors: parsed.error.flatten() }, { status: 400 });
  }

  return parsed.data;
};

export const validateParams = (params: LoaderArgs['params']) => {
  const paramsSchema = z.object({
    id: z.string()
  });
  const parsed = zx.parseParamsSafe(params, paramsSchema);

  if (!parsed.success) {
    return throwNotFound();
  }

  return parsed.data.id;
};
