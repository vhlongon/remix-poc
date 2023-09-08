import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { paths } from '../../types';
import { createJoke, deleteJoke, getJokes, throwNotFound, updateJoke } from '../../utils/data';
import { validateParams, validateQuery } from '../../utils/validation';

type GetJokeResponse =
  paths['/jokes/{id}']['get']['responses']['200']['content']['application/json'];

export const loader = async ({ params }: LoaderArgs) => {
  const id = validateParams(params);

  const jokes = await getJokes();

  const joke = jokes.find((j) => j.id === id);

  if (!joke) {
    return throwNotFound();
  }

  const response: GetJokeResponse = {
    data: joke
  };

  return json(response, 200);
};

type DeleteResponse =
  paths['/jokes/{id}']['delete']['responses']['200']['content']['application/json'];

type PatchResponse =
  paths['/jokes/{id}']['patch']['responses']['200']['content']['application/json'];

type PostResponse = paths['/jokes']['post']['responses']['200']['content']['application/json'];

export const action = async ({ request, params }: LoaderArgs) => {
  const id = validateParams(params);

  const jokes = await getJokes();
  const joke = jokes.find((j) => j.id === id);

  if (!joke) {
    return throwNotFound();
  }

  switch (request.method) {
    case 'POST': {
      const args = validateQuery(request);
      const response: PostResponse = { data: await createJoke(args) };

      return json(response, 200);
    }
    case 'PATCH': {
      const args = validateQuery(request);
      const response: PatchResponse = { data: await updateJoke(id, args) };

      return json(response, 200);
    }
    case 'DELETE': {
      const response: DeleteResponse = { data: await deleteJoke(id) };
      return json(response, 200);
    }
    case 'PUT': {
      throw json({ message: 'use PATCH to update the joke' }, { status: 400 });
    }

    default: {
      return throwNotFound();
    }
  }
};
