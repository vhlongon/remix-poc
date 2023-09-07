import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import data from '../../data.json';
import { createJoke, deleteJoke, throwNotFound, updateJoke } from '../../utils/data';
import { validateParams, validateQuery } from '../../utils/validation';

export const loader = async ({ params }: LoaderArgs) => {
  const id = validateParams(params);

  const joke = data.jokes.find((j) => j.id === id);

  if (!joke) {
    return throwNotFound();
  }

  return json(joke, 200);
};

export const action = async ({ request, params }: LoaderArgs) => {
  const id = validateParams(params);

  const joke = data.jokes.find((j) => j.id === id);

  if (!joke) {
    return throwNotFound();
  }

  switch (request.method) {
    case 'POST': {
      const args = validateQuery(request);
      await createJoke(args);
    }
    case 'PATCH': {
      const args = validateQuery(request);
      await updateJoke(id, args);
      return json({ message: `joke with id ${id} updated` }, 200);
    }
    case 'DELETE': {
      await deleteJoke(id);
      return json({ message: `joke with id ${id} deleted` }, 200);
    }
    case 'PUT': {
      throw json({ message: 'use PATCH to update the joke' }, { status: 400 });
    }

    default: {
      return throwNotFound();
    }
  }
};
