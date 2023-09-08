import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { paths } from '../types';
import { createJoke, getJokes } from '../utils/data';
import { validateQuery } from '../utils/validation';

type GetJokesResponse = paths['/jokes']['get']['responses']['200']['content']['application/json'];

export const loader = async () => {
  const response: GetJokesResponse = {
    data: await getJokes()
  };

  return json(response, 200);
};

export const action = async ({ request, params }: LoaderArgs) => {
  if (request.method === 'POST') {
    const args = validateQuery(request);
    await createJoke(args);
    return json({ message: 'joke created' }, 200);
  } else {
    return json({});
  }
};
