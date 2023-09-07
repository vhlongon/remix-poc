import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import data from '../data.json';
import { createJoke } from '../utils/data';
import { validateQuery } from '../utils/validation';

export const loader = async () => {
  return json(data.jokes, 200);
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
