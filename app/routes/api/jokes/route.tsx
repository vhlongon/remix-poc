import { json } from '@remix-run/node';
import type { paths } from '../types';
import { getJokes } from '../utils/data';

type GetJokesResponse = paths['/jokes']['get']['responses']['200']['content']['application/json'];

export const loader = async () => {
  const response: GetJokesResponse = {
    data: await getJokes()
  };

  return json(response, 200);
};
